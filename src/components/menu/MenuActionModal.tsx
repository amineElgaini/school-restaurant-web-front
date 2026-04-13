import Modal from "../ui/Modal";
import Button from "../ui/Button";
import type { Meal } from "../../types/meal";
import Badge from "../ui/Badge";

type Props = {
  isOpen: boolean;
  meal: Meal | null;
  planned: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export default function MenuActionModal({
  isOpen,
  meal,
  planned,
  loading,
  onClose,
  onConfirm,
}: Props) {
  if (!meal) return null;

  return (
    <Modal
      isOpen={isOpen}
      title={planned ? "Confirm Removal" : "Plan Selection"}
      onClose={onClose}
    >
      <div className="space-y-6 pt-2">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
           <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-white shadow-sm ${planned ? "bg-red-500" : "bg-primary-600"}`}>
              {planned ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
           </div>
           <div>
              <h4 className="font-bold text-slate-900">{meal.name}</h4>
              <Badge variant="neutral" className="mt-1">{meal.meal_type?.name || "Main Course"}</Badge>
           </div>
        </div>

        <p className="text-slate-600 leading-relaxed px-1">
          {planned
            ? `Are you sure you want to remove this dish from today's menu selection? This will hide the meal from student reservations.`
            : `Add this dish to today's menu? Students will be able to start placing reservations for it immediately.`}
        </p>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose} className="font-bold text-slate-500">
            Keep it as is
          </Button>

          <Button
            type="button"
            variant={planned ? "danger" : "primary"}
            disabled={loading}
            onClick={onConfirm}
            className="px-8"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : planned ? "Confirm Removal" : "Add to Menu"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}