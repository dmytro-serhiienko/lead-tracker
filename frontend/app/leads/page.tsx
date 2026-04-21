"use client";

import { FormEvent, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createLead, getLeads, LEAD_STATUSES } from "@/lib/api";
import { Lead, LeadsResponse, LeadStatus } from "@/lib/types";

const PAGE_SIZE = 8;

const statusBadge: Record<LeadStatus, string> = {
  NEW: "bg-slate-100 text-slate-700",
  CONTACTED: "bg-sky-100 text-sky-700",
  IN_PROGRESS: "bg-amber-100 text-amber-700",
  WON: "bg-emerald-100 text-emerald-700",
  LOST: "bg-rose-100 text-rose-700",
};

export default function LeadsPage() {
  const [data, setData] = useState<LeadsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState<"createdAt" | "updatedAt">("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    status: "NEW" as LeadStatus,
    value: "",
    notes: "",
  });
  const [createError, setCreateError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getLeads({
        page,
        limit: PAGE_SIZE,
        q,
        status,
        sort,
        order,
      });
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [page, q, status, sort, order]);

  useEffect(() => {
    const fetchLeads = async () => {
      await loadLeads();
    };
    fetchLeads();
  }, [page, q, status, sort, order, loadLeads]);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreateError(null);

    if (!form.name.trim()) {
      setCreateError("Name is required");
      return;
    }

    setCreating(true);
    try {
      await createLead({
        name: form.name.trim(),
        email: form.email.trim() || undefined,
        company: form.company.trim() || undefined,
        status: form.status,
        value: form.value ? Number(form.value) : undefined,
        notes: form.notes.trim() || undefined,
      });
      setForm({
        name: "",
        email: "",
        company: "",
        status: "NEW",
        value: "",
        notes: "",
      });
      setPage(1);
      await loadLeads();
    } catch (err) {
      setCreateError(
        err instanceof Error ? err.message : "Failed to create lead",
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
      <div className="mb-8 rounded-3xl bg-surface p-6 shadow-sm ring-1 ring-black/5">
        <h1 className="text-2xl font-semibold tracking-tight">Leads CRM</h1>
        <p className="mt-2 text-sm text-muted">
          Manage leads, update statuses, and keep context with comments.
        </p>
      </div>

      <section className="mb-8 rounded-3xl bg-surface p-6 shadow-sm ring-1 ring-black/5">
        <h2 className="mb-4 text-lg font-semibold">Create lead</h2>
        <form className="grid gap-3 md:grid-cols-2" onSubmit={handleCreate}>
          <input
            value={form.name}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, name: event.target.value }))
            }
            className="rounded-xl border border-slate-200 bg-white px-3 py-2"
            placeholder="Name *"
          />
          <input
            value={form.email}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, email: event.target.value }))
            }
            className="rounded-xl border border-slate-200 bg-white px-3 py-2"
            placeholder="Email"
          />
          <input
            value={form.company}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, company: event.target.value }))
            }
            className="rounded-xl border border-slate-200 bg-white px-3 py-2"
            placeholder="Company"
          />
          <select
            value={form.status}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                status: event.target.value as LeadStatus,
              }))
            }
            className="rounded-xl border border-slate-200 bg-white px-3 py-2"
          >
            {LEAD_STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <input
            value={form.value}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, value: event.target.value }))
            }
            className="rounded-xl border border-slate-200 bg-white px-3 py-2"
            placeholder="Estimated value"
            type="number"
            min={0}
          />
          <input
            value={form.notes}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, notes: event.target.value }))
            }
            className="rounded-xl border border-slate-200 bg-white px-3 py-2"
            placeholder="Notes"
          />
          <div>
            {createError ? (
              <p className="mb-2 text-sm text-red-600">{createError}</p>
            ) : null}
            <div>
              <button
                type="submit"
                disabled={creating}
                className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {creating ? "Creating..." : "Create lead"}
              </button>
            </div>
          </div>
        </form>
      </section>

      <section className="rounded-3xl bg-surface p-6 shadow-sm ring-1 ring-black/5">
        <div className="mb-4 grid gap-3 md:grid-cols-4">
          <input
            value={q}
            onChange={(event) => {
              setPage(1);
              setQ(event.target.value);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2"
            placeholder="Search name/email/company"
          />
          <select
            value={status}
            onChange={(event) => {
              setPage(1);
              setStatus(event.target.value);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2"
          >
            <option value="">All statuses</option>
            {LEAD_STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(event) =>
              setSort(event.target.value as "createdAt" | "updatedAt")
            }
            className="rounded-xl border border-slate-200 bg-white px-3 py-2"
          >
            <option value="createdAt">Sort by createdAt</option>
            <option value="updatedAt">Sort by updatedAt</option>
          </select>
          <select
            value={order}
            onChange={(event) => setOrder(event.target.value as "asc" | "desc")}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2"
          >
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
        </div>

        {loading ? (
          <p className="text-sm text-muted">Loading leads...</p>
        ) : null}
        {error ? <p className="text-sm text-red-600">Error: {error}</p> : null}

        {!loading && !error && data?.items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-muted">
            No leads found. Create your first lead or adjust filters.
          </p>
        ) : null}

        {!loading && !error && data?.items.length ? (
          <div className="grid gap-3">
            {data.items.map((lead: Lead) => (
              <article
                key={lead.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-semibold">{lead.name}</h3>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusBadge[lead.status]}`}
                  >
                    {lead.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted">
                  {lead.email || "No email"} • {lead.company || "No company"}
                </p>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span>
                    Value: {lead.value != null ? `$${lead.value}` : "-"}
                  </span>
                  <Link
                    className="rounded-lg bg-accent-soft px-3 py-1.5 font-medium text-accent"
                    href={`/leads/${lead.id}`}
                  >
                    Open details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {!loading && !error && data ? (
          <div className="mt-5 flex items-center justify-between text-sm">
            <span className="text-muted">
              Page {data.meta.page} of {data.meta.totalPages} •{" "}
              {data.meta.total} total
            </span>
            <div className="flex gap-2">
              <button
                className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-50"
                disabled={page <= 1}
                onClick={() => setPage((prev) => prev - 1)}
                type="button"
              >
                Prev
              </button>
              <button
                className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-50"
                disabled={page >= data.meta.totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                type="button"
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
