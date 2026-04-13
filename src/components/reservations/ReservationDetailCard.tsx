import Card from "../ui/Card";
import Badge from "../ui/Badge";
import type { UserReservationItem } from "../../types/staffReservation";

type Props = {
  reservation: UserReservationItem;
};

export default function ReservationDetailCard({ reservation }: Props) {
  const meal = reservation.menu_meal.meal;
  const mealType = meal.meal_type?.name ?? "Main Dish";

  return (
    <Card className="border-slate-100 bg-slate-50/30">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-base font-bold text-slate-900 leading-tight">
              {meal.name}
            </h4>
            <Badge variant="info" className="text-[10px] py-0 px-1.5 h-4">
              {mealType}
            </Badge>
          </div>
          
          {meal.description && (
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {meal.description}
            </p>
          )}

          <div className="pt-2 flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <svg className="mr-1.5 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Served at: {reservation.menu_meal.served_at}
          </div>
        </div>
        
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-primary-600 shadow-sm">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>
    </Card>
  );
}