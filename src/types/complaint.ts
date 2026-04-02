export type ComplaintUser = {
  id: number;
  name: string;
  email: string;
};

export type Complaint = {
  id: number;
  subject?: string;
  description: string;
  status?: string;
  created_at: string;
  user: ComplaintUser | null;
};