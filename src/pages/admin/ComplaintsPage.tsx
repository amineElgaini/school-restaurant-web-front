import { useEffect, useState } from "react";
import ComplaintsTable from "../../components/complaints/ComplaintsTable";
import { getComplaintsApi } from "../../api/complaints.api";
import type { Complaint } from "../../types/complaint";
import Badge from "../../components/ui/Badge";
import toast from "react-hot-toast";

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadComplaints();
  }, []);

  async function loadComplaints() {
    try {
      setLoading(true);
      setError("");

      const data = await getComplaintsApi();
      setComplaints(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load complaints.");
      toast.error("Could not fetch complaints records");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-8">
        <div className="space-y-1">
          <Badge variant="danger">Feedback Loop</Badge>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight font-display">
            Student Complaints
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Review and address issues raised by students regarding cafeteria services.
          </p>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {loading ? (
          <div className="space-y-4">
             {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 w-full animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-red-50 border border-red-100 text-red-700 font-medium animate-in shake duration-500">
            <div className="flex items-center gap-3">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          </div>
        ) : (
          <ComplaintsTable complaints={complaints} />
        )}
      </div>
    </div>
  );
}