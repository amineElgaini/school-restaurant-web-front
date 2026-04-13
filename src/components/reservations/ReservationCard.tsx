import Button from "../ui/Button";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import type { Reservation } from "../../types/reservation";

type Props = {
  reservation: Reservation;
  onRemove: (reservationId: number) => void;
};

export default function ReservationCard({ reservation, onRemove }: Props) {
  const meal = reservation.menu_meal.meal;
  const mealType = meal.meal_type?.name || "Main Course";

  return (
    <Card className="p-0 overflow-hidden border-slate-200/60 shadow-md">
      <div className="flex flex-col sm:flex-row">
        {/* Left Side: Brief Info */}
        <div className="flex items-center gap-4 p-5 sm:flex-1">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-slate-900 truncate">{meal.name}</h3>
              <Badge variant="info">{mealType}</Badge>
            </div>
            <p className="text-sm font-medium text-slate-500">
              Reserved for {reservation.menu_meal.served_at || "Scheduled Time"}
            </p>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center justify-end bg-slate-50/50 p-5 sm:bg-transparent">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-500 hover:bg-red-50 hover:text-red-600 font-bold"
            onClick={() => onRemove(reservation.id)}
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Cancel Order
          </Button>
        </div>
      </div>
    </Card>
  );
}