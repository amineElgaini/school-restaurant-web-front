import { useEffect, useState } from "react";
import ComplaintsTable from "../../components/complaints/ComplaintsTable";
import { getComplaintsApi } from "../../api/complaints.api";
import type { Complaint } from "../../types/complaint";

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
      console.log(data);
      
    } catch (err) {
      console.error(err);
      setError("Failed to load complaints.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Complaints</h1>
        <p className="text-gray-600">Manage and review student complaints.</p>
      </div>

      {loading && <p>Loading complaints...</p>}

      {!loading && error && (
        <div className="p-4 rounded bg-red-100 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <ComplaintsTable complaints={complaints} />
      )}
    </div>
  );
}