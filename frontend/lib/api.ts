import { Lead, LeadComment, LeadsResponse, LeadStatus } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

interface ApiErrorPayload {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let parsed: ApiErrorPayload | undefined;
    try {
      parsed = (await response.json()) as ApiErrorPayload;
    } catch {
      parsed = undefined;
    }

    const message = Array.isArray(parsed?.message)
      ? parsed?.message.join(", ")
      : parsed?.message || parsed?.error || `HTTP ${response.status}`;
    throw new Error(message);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}

export const LEAD_STATUSES: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "IN_PROGRESS",
  "WON",
  "LOST",
];

export function getLeads(params: {
  page: number;
  limit: number;
  q: string;
  status: string;
  sort: "createdAt" | "updatedAt";
  order: "asc" | "desc";
}) {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
    sort: params.sort,
    order: params.order,
  });
  if (params.q.trim()) {
    query.set("q", params.q.trim());
  }
  if (params.status) {
    query.set("status", params.status);
  }
  return request<LeadsResponse>(`/leads?${query.toString()}`);
}

export function createLead(payload: {
  name: string;
  email?: string;
  company?: string;
  status?: LeadStatus;
  value?: number;
  notes?: string;
}) {
  return request<Lead>("/leads", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getLead(id: number) {
  return request<Lead>(`/leads/${id}`);
}

export function updateLead(
  id: number,
  payload: Partial<{
    name: string;
    email: string;
    company: string;
    status: LeadStatus;
    value: number;
    notes: string;
  }>,
) {
  return request<Lead>(`/leads/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteLead(id: number) {
  return request<{ message: string }>(`/leads/${id}`, {
    method: "DELETE",
  });
}

export function getComments(leadId: number) {
  return request<LeadComment[]>(`/leads/${leadId}/comments`);
}

export function createComment(leadId: number, text: string) {
  return request<LeadComment>(`/leads/${leadId}/comments`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}
