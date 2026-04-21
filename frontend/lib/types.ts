export type LeadStatus = "NEW" | "CONTACTED" | "IN_PROGRESS" | "WON" | "LOST";

export interface Lead {
  id: number;
  name: string;
  email: string | null;
  company: string | null;
  status: LeadStatus;
  value: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LeadComment {
  id: number;
  leadId: number;
  text: string;
  createdAt: string;
}

export interface LeadsResponse {
  items: Lead[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
