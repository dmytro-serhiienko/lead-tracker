"use client";

import { useEffect, useState, useMemo, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getLead,
  updateLead,
  deleteLead,
  getComments,
  createComment,
  LEAD_STATUSES,
} from "@/lib/api";
import { Lead, LeadStatus, LeadComment } from "@/lib/types";

export default function LeadDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [leadId, setLeadId] = useState<number | null>(null);
  const [lead, setLead] = useState<Lead | null>(null);
  const [loadingLead, setLoadingLead] = useState(true);
  const [errorLead, setErrorLead] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    status: "NEW" as LeadStatus,
    value: "",
    notes: "",
  });
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const [addingComment, setAddingComment] = useState(false);
  const [comments, setComments] = useState<LeadComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [errorComments, setErrorComments] = useState<string | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      const parsed = Number(resolved.id);
      setLeadId(Number.isNaN(parsed) ? null : parsed);
    };
    void resolveParams();
  }, [params]);

  const loadLead = async (id: number) => {
    setLoadingLead(true);
    setErrorLead(null);
    try {
      const leadData = await getLead(id);
      setLead(leadData);
      setForm({
        name: leadData.name,
        email: leadData.email ?? "",
        company: leadData.company ?? "",
        status: leadData.status,
        value: leadData.value != null ? String(leadData.value) : "",
        notes: leadData.notes ?? "",
      });
    } catch (err) {
      setErrorLead(err instanceof Error ? err.message : "Failed to load lead");
    } finally {
      setLoadingLead(false);
    }
  };

  const loadComments = async (id: number) => {
    setLoadingComments(true);
    setErrorComments(null);
    try {
      const list = await getComments(id);
      setComments(list);
    } catch (err) {
      setErrorComments(
        err instanceof Error ? err.message : "Failed to load comments",
      );
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    if (leadId == null) {
      setTimeout(() => {
        setLoadingLead(false);
        setErrorLead("Invalid lead id");
      }, 0);
      return;
    }
    setTimeout(() => {
      void loadLead(leadId);
      void loadComments(leadId);
    }, 0);
  }, [leadId]);

  const updatedAt = useMemo(() => {
    if (!lead) {
      return "";
    }
    return new Date(lead.updatedAt).toLocaleString();
  }, [lead]);

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!leadId) {
      return;
    }
    if (!form.name.trim()) {
      setSaveError("Name is required");
      return;
    }

    setSaveError(null);
    setSaving(true);
    try {
      const updated = await updateLead(leadId, {
        name: form.name.trim(),
        email: form.email.trim() || undefined,
        company: form.company.trim() || undefined,
        status: form.status,
        value: form.value ? Number(form.value) : undefined,
        notes: form.notes.trim() || undefined,
      });
      setLead(updated);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to update lead",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!leadId || !window.confirm("Delete this lead?")) {
      return;
    }
    setDeleting(true);
    try {
      await deleteLead(leadId);
      router.push("/leads");
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to delete lead",
      );
      setDeleting(false);
    }
  };

  const handleAddComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!leadId) {
      return;
    }
    if (!commentText.trim()) {
      setCommentError("Comment text is required");
      return;
    }

    setCommentError(null);
    setAddingComment(true);
    try {
      await createComment(leadId, commentText.trim());
      setCommentText("");
      await loadComments(leadId);
    } catch (err) {
      setCommentError(
        err instanceof Error ? err.message : "Failed to add comment",
      );
    } finally {
      setAddingComment(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-5xl p-4 sm:p-6 lg:p-8">
      <div className="mb-5 flex items-center justify-between gap-2">
        <Link
          className="text-sm font-medium text-accent hover:underline"
          href="/leads"
        >
          ← Back to leads
        </Link>
        {lead ? (
          <span className="text-sm text-muted">Last update: {updatedAt}</span>
        ) : null}
      </div>

      <section className="mb-6 rounded-3xl bg-surface p-6 shadow-sm ring-1 ring-black/5">
        <h1 className="mb-4 text-2xl font-semibold">Lead details</h1>

        {loadingLead ? (
          <p className="text-sm text-muted">Loading lead...</p>
        ) : null}
        {errorLead ? (
          <p className="text-sm text-danger">Error: {errorLead}</p>
        ) : null}

        {!loadingLead && !errorLead && lead ? (
          <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSave}>
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

            {saveError ? (
              <p className="md:col-span-2 text-sm text-danger">{saveError}</p>
            ) : null}

            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete lead"}
              </button>
            </div>
          </form>
        ) : null}
      </section>

      <section className="rounded-3xl bg-surface p-6 shadow-sm ring-1 ring-black/5">
        <h2 className="mb-3 text-lg font-semibold">Comments</h2>

        <form className="mb-4 flex flex-col gap-2" onSubmit={handleAddComment}>
          <textarea
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            className="min-h-24 rounded-xl border border-slate-200 bg-white px-3 py-2"
            maxLength={500}
            placeholder="Add comment (1..500)"
          />
          {commentError ? (
            <p className="text-sm text-danger">{commentError}</p>
          ) : null}
          <button
            disabled={addingComment || !lead}
            className="w-fit rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            type="submit"
          >
            {addingComment ? "Adding..." : "Add comment"}
          </button>
        </form>

        {loadingComments ? (
          <p className="text-sm text-muted">Loading comments...</p>
        ) : null}
        {errorComments ? (
          <p className="text-sm text-danger">Error: {errorComments}</p>
        ) : null}

        {!loadingComments && !errorComments && comments.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-muted">
            No comments yet.
          </p>
        ) : null}

        {!loadingComments && !errorComments && comments.length > 0 ? (
          <ul className="grid gap-2">
            {comments.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-slate-200 bg-white p-3"
              >
                <p className="text-sm">{item.text}</p>
                <p className="mt-1 text-xs text-muted">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </main>
  );
}
