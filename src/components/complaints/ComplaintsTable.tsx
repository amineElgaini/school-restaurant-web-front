import type { Complaint } from "../../types/complaint";

type Props = {
  complaints: Complaint[];
};

export default function ComplaintsTable({ complaints }: Props) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border-b">ID</th>
            <th className="p-3 border-b">User</th>
            <th className="p-3 border-b">Email</th>
            <th className="p-3 border-b">Subject</th>
            <th className="p-3 border-b">Description</th>
            <th className="p-3 border-b">Status</th>
            <th className="p-3 border-b">Created At</th>
          </tr>
        </thead>

        <tbody>
          {complaints.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-4 text-center text-gray-500">
                No complaints found.
              </td>
            </tr>
          ) : (
            complaints.map((complaint) => (
              <tr key={complaint.id} className="hover:bg-gray-50">
                <td className="p-3 border-b">{complaint.id}</td>
                <td className="p-3 border-b">
                  {complaint.user?.name ?? "Unknown"}
                </td>
                <td className="p-3 border-b">
                  {complaint.user?.email ?? "-"}
                </td>
                <td className="p-3 border-b">{complaint.subject ?? "-"}</td>
                <td className="p-3 border-b">{complaint.description}</td>
                <td className="p-3 border-b">{complaint.status ?? "-"}</td>
                <td className="p-3 border-b">
                  {new Date(complaint.created_at).toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}