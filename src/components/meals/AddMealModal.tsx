import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import type { MealType } from "../../types/meal";
import { createMealApi } from "../../api/meals.api";

type Props = {
  open: boolean;
  mealTypes: MealType[];
  onClose: () => void;
  onSuccess: () => Promise<void> | void;
};

export default function AddMealModal({
  open,
  mealTypes,
  onClose,
  onSuccess,
}: Props) {
  const [name, setName] = useState("");
  const [mealTypeId, setMealTypeId] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    setName("");
    setMealTypeId("");
    setDescription("");
    setImage(null);
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("meal_type_id", String(mealTypeId));

      if (description.trim()) {
        formData.append("description", description);
      }

      if (image) {
        formData.append("image", image);
      }

      await createMealApi(formData);
      await onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to create meal", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const options = [
    { label: "Select type", value: "" },
    ...mealTypes.map((type) => ({
      label: type.name,
      value: type.id,
    })),
  ];

  return (
    <Modal open={open} title="Add New Meal" onClose={onClose}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Meal Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter meal name"
        />

        <Select
          label="Meal Type"
          value={mealTypeId}
          onChange={(e) =>
            setMealTypeId(e.target.value ? Number(e.target.value) : "")
          }
          options={options}
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            className="min-h-[100px] w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            className="w-full rounded-xl border px-3 py-2"
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Meal"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}