import Button from "../ui/Button";
import type { ReservationUser } from "../../types/staffReservation";

type Props = {
  users: ReservationUser[];
  onDetails: (user: ReservationUser) => void;
};

export default function UsersReservationTable({ users, onDetails }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50/50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
              Student
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
              Email Address
            </th>
            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200 bg-white">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-slate-50/50 transition-colors duration-150 group">
              <td className="whitespace-nowrap px-6 py-5">
                <div className="flex items-center gap-4">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="h-11 w-11 rounded-full border-2 border-white object-cover shadow-sm"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-bold border-2 border-white shadow-sm group-hover:bg-primary-50 group-hover:text-primary-700 transition-colors">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 group-hover:text-primary-700 transition-colors">
                      {user.name}
                    </span>
                    <span className="text-xs text-slate-400">Student ID: #{user.id}</span>
                  </div>
                </div>
              </td>

              <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-600 font-medium">
                {user.email}
              </td>

              <td className="whitespace-nowrap px-6 py-5 text-right">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onDetails(user)}
                  className="font-bold border-slate-200 text-slate-600 hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50"
                >
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}