import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import type { Permission, Role, UserEditData } from "../../types/user";
import { getAssignablePermissionsByRoleApi } from "../../api/users.api";

type Props = {
  isOpen: boolean;
  data: UserEditData | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    name: string;
    email: string;
    role_id: number | "";
    image?: File | null;
    direct_permission_slugs: string[];
  }) => Promise<void>;
};

export default function UpdateUserModal({
  isOpen,
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
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!data) return;

    setName(data.user.name);
    setEmail(data.user.email);
    setRoleId(data.user.role?.id ?? "");
    setAssignablePermissions(data.assignable_permissions);
    setSelectedPermissions(data.direct_permissions);
    setImage(null);
    setImagePreview(data.user.image);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        name,
        email,
        role_id: roleId,
        image,
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
    <Modal isOpen={isOpen} title="Edit Account Profile" onClose={onClose}>
      {loading || !data ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
           <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-primary-600" />
           <p className="text-slate-500 font-medium">Fetching profile records...</p>
        </div>
      ) : (
        <form className="space-y-8 pt-2" onSubmit={handleSubmit}>
          <div className="grid gap-6 sm:grid-cols-2">
            <Input
              label="Full Name"
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

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700">Profile Picture</label>
            <div className="flex items-center gap-6 p-4 rounded-2xl border border-slate-200 bg-slate-50/30">
              <div className="h-20 w-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-100 flex-shrink-0">
                {imagePreview ? (
                  <img src={imagePreview} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-slate-300">
                    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  id="edit-user-image"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <div className="flex items-center gap-3">
                  <label 
                    htmlFor="edit-user-image"
                    className="inline-flex items-center px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition-all shadow-sm"
                  >
                    Change Photo
                  </label>
                  {image && (
                    <button 
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setImagePreview(data?.user.image || null);
                      }}
                      className="text-xs font-bold text-red-500 hover:text-red-600"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-400">Upload a new photo (max 2MB). Recommended: Square aspect ratio.</p>
              </div>
            </div>
          </div>

          <Select
            label="Security Role"
            value={roleId}
            onChange={(e) => handleRoleChange(e.target.value)}
            options={[
              { label: "Assign a role...", value: "" },
              ...roleOptions,
            ]}
            required
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
               <label className="text-sm font-bold text-slate-700">Granular Permissions</label>
               <Badge variant="neutral">Optional Override</Badge>
            </div>

            <div className={`rounded-2xl border bg-slate-50/30 p-4 transition-all ${assignablePermissions.length === 0 ? "border-slate-100" : "border-slate-200"}`}>
                {assignablePermissions.length === 0 ? (
                  <p className="text-sm text-slate-400 italic py-2 text-center">
                    No individual permissions available for this role.
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

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={onClose} className="font-bold text-slate-500">
              Discard Changes
            </Button>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="px-10 shadow-md shadow-primary-500/10"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </span>
              ) : "Save Changes"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}