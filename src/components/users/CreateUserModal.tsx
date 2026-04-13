import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import type { Permission, Role } from "../../types/user";
import {
  createUserApi,
  getAssignablePermissionsByRoleApi,
} from "../../api/users.api";
import toast from "react-hot-toast";

type Props = {
  isOpen: boolean;
  roles: Role[];
  onClose: () => void;
  onSuccess: () => Promise<void> | void;
};

export default function CreateUserModal({
  isOpen,
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
    if (!isOpen) return;

    setName("");
    setEmail("");
    setPassword("");
    setRoleId("");
    setAssignablePermissions([]);
    setSelectedPermissions([]);
  }, [isOpen]);

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
    if (!name.trim() || !email.trim() || !password || !roleId) {
      toast.error("All highlighted fields are required");
      return;
    }

    setIsSubmitting(true);

    try {
      await createUserApi({
        name,
        email,
        password,
        role_id: roleId,
        direct_permission_slugs: selectedPermissions,
      });
      toast.success("New user account created successfully!");

      await onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to create user", error);
      toast.error("Failed to create user account");
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleOptions = [
    { label: "Assign Primary Role...", value: "" },
    ...roles.map((role) => ({
      label: role.name,
      value: role.id,
    })),
  ];

  return (
    <Modal isOpen={isOpen} title="Create New Account" onClose={onClose}>
      <form className="space-y-8 pt-2" onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <Input
              label="FullName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              required
            />

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
            />
          </div>

          <Input
            label="Initial Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 characters"
            required
          />

          <Select
            label="User Role"
            value={roleId}
            onChange={(e) => handleRoleChange(e.target.value)}
            options={roleOptions}
            required
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
               <label className="text-sm font-bold text-slate-700">Special Permissions</label>
               <Badge variant="neutral">Optional</Badge>
            </div>

            <div className={`rounded-2xl border bg-slate-50/30 p-4 transition-all ${assignablePermissions.length === 0 ? "border-slate-100" : "border-slate-200"}`}>
                {assignablePermissions.length === 0 ? (
                  <p className="text-sm text-slate-400 italic py-2 text-center">
                    Select a role to see available individual permissions.
                  </p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {assignablePermissions.map((permission) => (
                      <label
                        key={permission.slug}
                        className={`
                          relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border
                          ${selectedPermissions.includes(permission.slug) 
                            ? "border-primary-200 bg-white shadow-sm ring-2 ring-primary-500/5" 
                            : "border-transparent bg-transparent hover:bg-white/50"
                          }
                        `}
                      >
                        <div className={`
                          flex h-5 w-5 items-center justify-center rounded border transition-colors
                          ${selectedPermissions.includes(permission.slug) 
                            ? "border-primary-600 bg-primary-600 text-white" 
                            : "border-slate-300 bg-white"
                          }
                        `}>
                           {selectedPermissions.includes(permission.slug) && (
                             <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                               <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                             </svg>
                           )}
                           <input
                            type="checkbox"
                            className="absolute opacity-0"
                            checked={selectedPermissions.includes(permission.slug)}
                            onChange={() => togglePermission(permission.slug)}
                           />
                        </div>
                        <span className={`text-sm font-medium ${selectedPermissions.includes(permission.slug) ? "text-slate-900" : "text-slate-600"}`}>
                          {permission.name}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-4">
          <Button type="button" variant="ghost" onClick={onClose} className="font-bold text-slate-500">
            Cancel
          </Button>

          <Button 
            type="submit" 
            disabled={isSubmitting || !name.trim() || !email.trim() || !password || !roleId}
            className="px-10 shadow-md shadow-primary-500/10"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating...
              </span>
            ) : "Register User"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}