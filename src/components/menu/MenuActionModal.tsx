import Modal from "../ui/Modal";
import Button from "../ui/Button";
import type { Meal } from "../../types/meal";

type Props = {
  open: boolean;
  meal: Meal | null;
  planned: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export default function MenuActionModal({
  open,
  meal,
  planned,
  loading,
  onClose,
  onConfirm,
}: Props) {
  if (!meal) return null;

  return (
    <Modal
      open={open}
      title={planned ? "Remove Meal From Menu" : "Add Meal To Menu"}
      onClose={onClose}
    >
      <div className="space-y-4">
        <p className="text-gray-700">
          {planned
            ? `Are you sure you want to remove "${meal.name}" from the selected day menu?`
            : `Are you sure you want to add "${meal.name}" to the selected day menu?`}
        </p>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button
            type="button"
            variant={planned ? "danger" : "primary"}
            disabled={loading}
            onClick={onConfirm}
          >
            {loading ? "Processing..." : planned ? "Remove" : "Add"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}