import type { Complaint } from "../../types/complaint";
import Card from "../ui/Card";

type Props = {
  complaints: Complaint[];
};

export default function ComplaintsTable({ complaints }: Props) {
  return (
    <Card className="overflow-hidden border-slate-200/60 shadow-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                User
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Subject
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Description
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                Submitted
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 bg-white">
            {complaints.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium italic">
                  No complaints found in the records.
                </td>
              </tr>
            ) : (
              complaints.map((complaint) => (
                <tr key={complaint.id} className="hover:bg-slate-50/50 transition-colors duration-150 group">
                  <td className="whitespace-nowrap px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-bold border-2 border-white shadow-sm group-hover:bg-primary-50 group-hover:text-primary-700 transition-colors">
                        {complaint.user?.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{complaint.user?.name || "Unknown User"}</span>
                        <span className="text-xs text-slate-400">{complaint.user?.email || "-"}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-slate-700 leading-tight">
                      {complaint.subject || "No Subject"}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <p className="max-w-xs truncate text-sm text-slate-500" title={complaint.description}>
                      {complaint.description}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-6 py-5 text-right text-xs font-medium text-slate-400 uppercase tracking-widest">
                    {new Date(complaint.created_at).toLocaleDateString()}
                    <span className="ml-2">
                       {new Date(complaint.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}