import Card from "../ui/Card";
import type { UserReservationItem } from "../../types/staffReservation";

type Props = {
  reservation: UserReservationItem;
};

export default function ReservationDetailCard({ reservation }: Props) {
  const meal = reservation.menu_meal.meal;
  const mealType = meal.meal_type?.name ?? "Unknown type";

  return (
    <Card>
      <div className="space-y-2">
        <h4 className="text-lg font-semibold">{meal.name}</h4>
        <p className="text-sm text-gray-500">{mealType}</p>

        {meal.description && (
          <p className="text-sm text-gray-700">{meal.description}</p>
        )}

        <p className="text-sm text-gray-500">
          Served at: {reservation.menu_meal.served_at}
        </p>
      </div>
    </Card>
  );
}