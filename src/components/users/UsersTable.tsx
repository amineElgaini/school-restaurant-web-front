import Button from "../ui/Button";
import Card from "../ui/Card";
import type { UserListItem } from "../../types/user";

type Props = {
  users: UserListItem[];
  onEdit: (user: UserListItem) => void;
  onDelete: (userId: number) => void;
};

export default function UsersTable({ users, onEdit, onDelete }: Props) {
  return (
    <Card className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="border-b text-left">
            <th className="px-4 py-3">User</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <span className="font-medium">{user.name}</span>
                </div>
              </td>

              <td className="px-4 py-3">{user.email}</td>

              <td className="px-4 py-3">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                  {user.role?.name ?? "No role"}
                </span>
              </td>

              <td className="px-4 py-3">
                <Button variant="secondary" onClick={() => onEdit(user)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => onDelete(user.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
