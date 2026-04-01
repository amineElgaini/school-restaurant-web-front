import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import type { Permission, Role, UserEditData } from "../../types/user";
import { getAssignablePermissionsByRoleApi } from "../../api/users.api";

type Props = {
  open: boolean;
  data: UserEditData | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    name: string;
    email: string;
    role_id: number | "";
    direct_permission_slugs: string[];
  }) => Promise<void>;
};

export default function UpdateUserModal({
  open,
  data,
  loading,
  onClose,
  onSubmit,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState<number | "">("");
  const [assignablePermissions, setAssignablePermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!data) return;

    setName(data.user.name);
    setEmail(data.user.email);
    setRoleId(data.user.role?.id ?? "");
    setAssignablePermissions(data.assignable_permissions);
    setSelectedPermissions(data.direct_permissions);

  }, [data]);

  const handleRoleChange = async (value: string) => {
    const parsedRoleId = value ? Number(value) : "";
    setRoleId(parsedRoleId);

    if (!parsedRoleId) {
      setAssignablePermissions([]);
      setSelectedPermissions([]);
      return;
    }

    try {
      const permissions = await getAssignablePermissionsByRoleApi(parsedRoleId);
      setAssignablePermissions(permissions);
      setSelectedPermissions([]);
    } catch (error) {
      console.error("Failed to fetch assignable permissions", error);
    }
  };

  const togglePermission = (slug: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(slug)
        ? prev.filter((item) => item !== slug)
        : [...prev, slug]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        name,
        email,
        role_id: roleId,
        direct_permission_slugs: selectedPermissions,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleOptions =
    data?.roles.map((role: Role) => ({
      label: role.name,
      value: role.id,
    })) ?? [];

  return (
    <Modal open={open} title="Update User" onClose={onClose}>
      {loading || !data ? (
        <p>Loading...</p>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Select
            label="Role"
            value={roleId}
            onChange={(e) => handleRoleChange(e.target.value)}
            options={[
              { label: "Select role", value: "" },
              ...roleOptions,
            ]}
          />

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Extra Permissions</p>

            {assignablePermissions.length === 0 ? (
              <p className="text-sm text-gray-500">No assignable permissions for this role.</p>
            ) : (
              <div className="space-y-2 rounded-xl border p-3">
                {assignablePermissions.map((permission) => (
                  <label
                    key={permission.slug}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(permission.slug)}
                      onChange={() => togglePermission(permission.slug)}
                    />
                    {permission.name}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}