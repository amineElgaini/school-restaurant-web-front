import Button from "../ui/Button";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import type { Reservation } from "../../types/reservation";

type Props = {
  reservation: Reservation;
  onRemove: (reservationId: number) => void;
};

function formatServedAt(dateStr: string | null | undefined): string {
  if (!dateStr) return "Scheduled Time";
  
  // Extract just the YYYY-MM-DD part if it's a full ISO string
  const cleanDateStr = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
  
  const date = new Date(`${cleanDateStr}T00:00`);
  if (!isNaN(date.getTime())) {
    const formatted = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
    return `${formatted} · 1:00 PM`;
  }
  
  return `${cleanDateStr} · 1:00 PM`;
}

export default function ReservationCard({ reservation, onRemove }: Props) {
  const meal = reservation.menu_meal.meal;
  const mealType = meal.meal_type?.name || "Main Course";

  return (
    <Card className="p-0 overflow-hidden border-slate-200/60 shadow-md">
      <div className="flex flex-col">
        {/* Top: Meal Info */}
        <div className="flex items-center gap-4 p-4">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <h3 className="text-base font-bold text-slate-900 truncate">{meal.name}</h3>
              <Badge variant="info">{mealType}</Badge>
            </div>
            <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
              <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatServedAt(reservation.menu_meal.served_at)}
            </p>
          </div>
        </div>

        {/* Bottom: Actions */}
        <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50/60 px-4 py-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:bg-red-50 hover:text-red-600 font-semibold text-sm"
            onClick={() => onRemove(reservation.id)}
          >
            <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  );
}