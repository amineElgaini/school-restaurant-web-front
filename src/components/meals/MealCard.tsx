import Button from "../ui/Button";
import Card from "../ui/Card";
import type { MenuMeal } from "../../types/reservation";

type Props = {
  menuMeal: MenuMeal;
  isExactReserved: boolean;
  isSameTypeReserved: boolean;
  onReserve: (menuMealId: number) => void;
};

export default function MealCard({
  menuMeal,
  isExactReserved,
  isSameTypeReserved,
  onReserve,
}: Props) {
  const meal = menuMeal.meal;
  const mealType = meal.meal_type?.name || "Unknown type";

  let buttonText = "Reserve";
  let disabled = false;
  let variant: "primary" | "danger" | "secondary" = "primary";

  if (isExactReserved) {
    buttonText = "Reserved";
    variant = "secondary";
    disabled = true;
  } else if (isSameTypeReserved) {
    buttonText = "Same type already reserved";
    variant = "secondary";
    disabled = true;
  }

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
          disabled={disabled}
          variant={variant}
          className="w-full"
        >
          {buttonText}
        </Button>
      </div>
    </Card>
  );
}