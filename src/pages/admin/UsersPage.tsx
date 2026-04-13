import { useEffect, useState } from "react";
import UsersTable from "../../components/users/UsersTable";
import UpdateUserModal from "../../components/users/UpdateUserModal";
import {
  deleteUserApi,
  getUserEditDataApi,
  getUsersApi,
  updateUserApi,
} from "../../api/users.api";
import type { UserEditData, UserListItem } from "../../types/user";
import Button from "../../components/ui/Button";

import CreateUserModal from "../../components/users/CreateUserModal";
import { getRolesApi } from "../../api/users.api";
import type { Role } from "../../types/user";
import toast from "react-hot-toast";

export default function UsersPage() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);

  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [editData, setEditData] = useState<UserEditData | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsersApi();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
      toast.error("Failed to load users list");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await getRolesApi();
      setRoles(data);
    } catch (error) {
      console.error("Failed to fetch roles", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const handleEdit = async (user: UserListItem) => {
    setSelectedUser(user);
    setModalOpen(true);
    setEditLoading(true);

    try {
      const data = await getUserEditDataApi(user.id);
      setEditData(data);
    } catch (error) {
      console.error("Failed to fetch edit data", error);
      toast.error("Could not load user permissions");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      await deleteUserApi(userId);

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      toast.success("User deleted successfully.");
    } catch (error) {
      console.error("Delete user failed:", error);
      toast.error("Failed to delete user");
    }
  };

  const handleUpdate = async (payload: {
    name: string;
    email: string;
    role_id: number | "";
    direct_permission_slugs: string[];
  }) => {
    if (!selectedUser) return;

    try {
      await updateUserApi(selectedUser.id, payload);
      toast.success("User updated successfully.");
      await fetchUsers();
    } catch (error) {
      console.error("Failed to update user", error);
      throw error;
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
    setEditData(null);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-8">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight font-display">
            User Management
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Control access, manage roles, and update student/staff information.
          </p>
        </div>

        <Button 
          size="lg" 
          onClick={() => setCreateModalOpen(true)}
          className="shadow-md shadow-primary-500/20"
        >
          <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Add New User
        </Button>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {loading ? (
          <div className="space-y-4">
            <div className="h-12 w-full animate-pulse rounded-xl bg-slate-100" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 w-full animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <div className="mb-6 rounded-full bg-slate-100 p-6 text-slate-300">
              <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">No users found</h3>
            <p className="mt-2 text-slate-500 max-w-sm">It seems there are no users in the system yet. Start by adding a new user.</p>
            <Button 
              variant="outline" 
              className="mt-8"
              onClick={() => setCreateModalOpen(true)}
            >
              Get Started
            </Button>
          </div>
        ) : (
          <UsersTable
            users={users}
            onEdit={handleEdit}
            onDelete={handleDeleteUser}
          />
        )}
      </div>

      <UpdateUserModal
        isOpen={modalOpen}
        data={editData}
        loading={editLoading}
        onClose={handleCloseModal}
        onSubmit={handleUpdate}
      />

      <CreateUserModal
        isOpen={createModalOpen}
        roles={roles}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={async () => {
          await fetchUsers();
        }}
      />
    </div>
  );
}
