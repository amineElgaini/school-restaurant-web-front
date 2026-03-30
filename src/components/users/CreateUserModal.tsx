import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import type { Permission, Role } from "../../types/user";
import {
  createUserApi,
  getAssignablePermissionsByRoleApi,
} from "../../api/users.api";

type Props = {
  open: boolean;
  roles: Role[];
  onClose: () => void;
  onSuccess: () => Promise<void> | void;
};

export default function CreateUserModal({
  open,
  roles,
  onClose,
  onSuccess,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState<number | "">("");
  const [assignablePermissions, setAssignablePermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    setName("");
    setEmail("");
    setPassword("");
    setRoleId("");
    setAssignablePermissions([]);
    setSelectedPermissions([]);
  }, [open]);

  const handleRoleChange = async (value: string) => {
    const parsedRoleId = value ? Number(value) : "";
    setRoleId(parsedRoleId);
    setSelectedPermissions([]);

    if (!parsedRoleId) {
      setAssignablePermissions([]);
      return;
    }

    try {
      const permissions = await getAssignablePermissionsByRoleApi(parsedRoleId);
      setAssignablePermissions(permissions);
    } catch (error) {
      console.error("Failed to fetch assignable permissions", error);
      setAssignablePermissions([]);
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
      await createUserApi({
        name,
        email,
        password,
        role_id: roleId,
        direct_permission_slugs: selectedPermissions,
      });

      await onSuccess();
      onClose();
    } catch (error) {
    //   console.error("Failed to create user", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleOptions = [
    { label: "Select role", value: "" },
    ...roles.map((role) => ({
      label: role.name,
      value: role.id,
    })),
  ];

  return (
    <Modal open={open} title="Create User" onClose={onClose}>
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

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Select
          label="Role"
          value={roleId}
          onChange={(e) => handleRoleChange(e.target.value)}
          options={roleOptions}
        />

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Extra Permissions</p>

          {assignablePermissions.length === 0 ? (
            <p className="text-sm text-gray-500">
              No assignable permissions for this role.
            </p>
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
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}