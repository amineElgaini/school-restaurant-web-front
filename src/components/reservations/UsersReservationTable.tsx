import Button from "../ui/Button";
import type { ReservationUser } from "../../types/staffReservation";

type Props = {
  users: ReservationUser[];
  onDetails: (user: ReservationUser) => void;
};

export default function UsersReservationTable({ users, onDetails }: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border bg-white">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="border-b bg-gray-50 text-left">
            <th className="px-4 py-3">User</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b last:border-b-0">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {user.image ? (
                    <img
                      src={`http://localhost:8000/storage/${user.image}`}
                      alt={user.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-600">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <span className="font-medium">{user.name}</span>
                </div>
              </td>

              <td className="px-4 py-3 text-gray-700">{user.email}</td>

              <td className="px-4 py-3">
                <Button variant="secondary" onClick={() => onDetails(user)}>
                  Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}