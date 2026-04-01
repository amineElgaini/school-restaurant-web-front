import Button from "../ui/Button";
import Card from "../ui/Card";
import type { Reservation } from "../../types/reservation";

type Props = {
  reservation: Reservation;
  onRemove: (reservationId: number) => void;
};

export default function ReservationCard({ reservation, onRemove }: Props) {
  const meal = reservation.menu_meal.meal;
  const mealType = meal.meal_type?.name || "Unknown type";

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{meal.name}</h3>
          <p className="text-sm text-gray-500">{mealType}</p>
          {meal.description && (
            <p className="mt-2 text-sm text-gray-700">{meal.description}</p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            Served at: {reservation.menu_meal.served_at}
          </p>
        </div>

        <Button variant="danger" onClick={() => onRemove(reservation.id)}>
          Cancel
        </Button>
      </div>
    </Card>
  );
}