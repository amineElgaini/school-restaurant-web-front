export type ComplaintUser = {
  id: number;
  name: string;
  email: string;
  image?: string;
};

export type Complaint = {
  id: number;
  subject?: string;
  description: string;
  status?: string;
  created_at: string;
  user: ComplaintUser | null;
};