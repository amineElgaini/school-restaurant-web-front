import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import type { Meal, MealType } from "../../types/meal";
import { createMealApi, updateMealApi } from "../../api/meals.api";
import toast from "react-hot-toast";

type Props = {
  isOpen: boolean;
  mealTypes: MealType[];
  meal?: Meal | null; // when provided → edit mode
  onClose: () => void;
  onSuccess: () => Promise<void> | void;
};

export default function AddMealModal({
  isOpen,
  mealTypes,
  meal = null,
  onClose,
  onSuccess,
}: Props) {
  const isEditMode = !!meal;

  const [name, setName] = useState("");
  const [mealTypeId, setMealTypeId] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-populate fields when editing, reset when opening for create
  useEffect(() => {
    if (!isOpen) return;

    if (meal) {
      setName(meal.name);
      setMealTypeId(meal.meal_type_id ?? meal.meal_type?.id ?? "");
      setDescription(meal.description ?? "");
      setImage(null);
    } else {
      setName("");
      setMealTypeId("");
      setDescription("");
      setImage(null);
    }
  }, [isOpen, meal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mealTypeId) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("meal_type_id", String(mealTypeId));
      formData.append("description", description ?? "");

      if (image) {
        formData.append("image", image);
      }

      if (isEditMode && meal) {
        await updateMealApi(meal.id, formData);
        toast.success("Dish updated successfully!");
      } else {
        await createMealApi(formData);
        toast.success("New dish added to the archive!");
      }

      await onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Failed to save meal", error);
      // Log the full server response for debugging
      if (error?.response) {
        console.error("Server response status:", error.response.status);
        console.error("Server response data:", error.response.data);
      }
      toast.error(
        isEditMode
          ? "An error occurred while updating the meal"
          : "An error occurred while creating the meal"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const options = [
    { label: "Choose Category...", value: "" },
    ...mealTypes.map((type) => ({
      label: type.name,
      value: type.id,
    })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      title={isEditMode ? "Edit Dish" : "Add New Dish"}
      onClose={onClose}
    >
      <form className="space-y-6 pt-2" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Dish Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Grilled Chicken Salad"
            required
          />

          <Select
            label="Category"
            value={mealTypeId}
            onChange={(e) =>
              setMealTypeId(e.target.value ? Number(e.target.value) : "")
            }
            options={options}
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 ml-1">
              Instructions or Description
            </label>
            <textarea
              className="min-h-[100px] w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-900 placeholder:text-slate-400 transition-all duration-200 outline-none hover:border-slate-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a brief description of the dish..."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 ml-1">
              Visual Representation
            </label>
            <div className="relative group">
              <input
                type="file"
                id="meal-image-upload"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                className="hidden"
              />
              <label
                htmlFor="meal-image-upload"
                className={`
                  flex items-center justify-center gap-3 w-full border-2 border-dashed rounded-2xl p-6 cursor-pointer
                  transition-all duration-200
                  ${
                    image
                      ? "border-primary-500 bg-primary-50/20 text-primary-700"
                      : "border-slate-200 bg-slate-50/50 text-slate-500 hover:border-primary-300 hover:bg-slate-50"
                  }
                `}
              >
                {image ? (
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-bold">{image.name}</span>
                  </div>
                ) : isEditMode && meal?.image ? (
                  <div className="flex flex-col items-center">
                    <svg className="h-8 w-8 mb-2 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium text-primary-600">Current image set — click to replace</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <svg className="h-8 w-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium">Click to upload an image</span>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
          <Button type="button" variant="ghost" onClick={onClose} className="font-bold text-slate-500">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !name.trim() || !mealTypeId}
            className="px-8 shadow-md shadow-primary-500/10"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : isEditMode ? (
              "Save Changes"
            ) : (
              "Save Dish"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}