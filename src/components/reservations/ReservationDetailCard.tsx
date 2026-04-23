import Card from "../ui/Card";
import Badge from "../ui/Badge";
import type { UserReservationItem } from "../../types/staffReservation";

type Props = {
  reservation: UserReservationItem;
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

export default function ReservationDetailCard({ reservation }: Props) {
  const meal = reservation.menu_meal.meal;
  const mealType = meal.meal_type?.name ?? "Main Dish";
  const imageUrl = meal.image ? `http://localhost:8000/storage/${meal.image}` : null;

  return (
    <Card className="group overflow-hidden border-slate-200/60 bg-white shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-stretch sm:h-32">
        {/* Meal Image/Placeholder */}
        <div className="relative w-full h-40 sm:w-32 sm:h-full shrink-0 overflow-hidden bg-slate-100">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={meal.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
              <svg className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          )}
          {/* Glass Badge Overlay */}
          <div className="absolute top-2 left-2 sm:bottom-2 sm:top-auto">
            <div className="rounded-full bg-black/40 backdrop-blur-md border border-white/20 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
              {mealType}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-4">
          <div className="space-y-1.5">
            <h4 className="text-lg font-bold text-slate-900 leading-tight">
              {meal.name}
            </h4>
            {meal.description ? (
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {meal.description}
              </p>
            ) : (
              <p className="text-xs italic text-slate-400">No description provided.</p>
            )}
          </div>

          <div className="flex items-center justify-between mt-4 sm:mt-2">
            <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2 py-1 text-[11px] font-bold text-slate-600 border border-slate-100">
              <svg className="h-3.5 w-3.5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatServedAt(reservation.menu_meal.served_at)}
            </div>

            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}