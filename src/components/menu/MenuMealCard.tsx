import Button from "../ui/Button";
import Card from "../ui/Card";
import type { Meal } from "../../types/meal";

type Props = {
  meal: Meal;
  planned: boolean;
  onAction: (meal: Meal, planned: boolean) => void;
};

export default function MenuMealCard({ meal, planned, onAction }: Props) {
  const imageUrl = meal.image
    ? `http://localhost:8000/storage/${meal.image}`
    : null;

  return (
    <Card className="space-y-3">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={meal.name}
          className="h-40 w-full rounded-xl object-cover"
        />
      ) : (
        <div className="flex h-40 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
          No image
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold">{meal.name}</h3>
        <p className="text-sm text-gray-500">
          {meal.meal_type?.name ?? `Type #${meal.meal_type_id}`}
        </p>
      </div>

      {meal.description && (
        <p className="text-sm text-gray-700">{meal.description}</p>
      )}

      <Button
        variant={planned ? "danger" : "primary"}
        className="w-full"
        onClick={() => onAction(meal, planned)}
      >
        {planned ? "Cancel" : "Add"}
      </Button>
    </Card>
  );
}