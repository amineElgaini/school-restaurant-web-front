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
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmed) return;

    try {
      await deleteUserApi(userId);

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Delete user failed:", error);
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
      console.log(payload);
      await updateUserApi(selectedUser.id, payload);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Users</h1>
          <p className="text-gray-600">
            Update user info, role, and extra permissions.
          </p>
        </div>

        <Button onClick={() => setCreateModalOpen(true)}>Create User</Button>
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <UsersTable users={users} onEdit={handleEdit} onDelete={handleDeleteUser} />
      )}

      <UpdateUserModal
        open={modalOpen}
        data={editData}
        loading={editLoading}
        onClose={handleCloseModal}
        onSubmit={handleUpdate}
      />

      <CreateUserModal
        open={createModalOpen}
        roles={roles}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={async () => {
          await fetchUsers();
        }}
      />
    </div>
  );
}
