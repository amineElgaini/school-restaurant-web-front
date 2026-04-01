import Button from "../ui/Button";
import Card from "../ui/Card";
import type { MenuMeal } from "../../types/reservation";

type Props = {
  menuMeal: MenuMeal;
  reserved: boolean;
  onReserve: (menuMealId: number) => void;
};

export default function MealCard({ menuMeal, reserved, onReserve }: Props) {
  const meal = menuMeal.meal;
  const mealType = meal.meal_type?.name || "Unknown type";

  return (
    <Card>
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold">{meal.name}</h3>
          <p className="text-sm text-gray-500">{mealType}</p>
          {meal.description && (
            <p className="mt-2 text-sm text-gray-700">{meal.description}</p>
          )}
        </div>

        <Button
          onClick={() => onReserve(menuMeal.id)}
          disabled={reserved}
          className="w-full"
        >
          {reserved ? "Reserved" : "Reserve"}
        </Button>
      </div>
    </Card>
  );
}