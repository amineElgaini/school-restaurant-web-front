import Button from "../ui/Button";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
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
  const mealType = meal.meal_type?.name || "Main Course";
  const imageUrl = meal.image
    ? `http://localhost:8000/storage/${meal.image}`
    : null;

  let statusBadge = null;
  let disabled = false;
  let buttonText = "Reserve Now";

  if (isExactReserved) {
    statusBadge = <Badge variant="success">Reserved</Badge>;
    disabled = true;
    buttonText = "Reserved";
  } else if (isSameTypeReserved) {
    statusBadge = <Badge variant="warning">Type Limit Reached</Badge>;
    disabled = true;
    buttonText = "Already Reserved Same Type";
  }

  return (
    <Card hover className="flex flex-col h-full group">
      {/* Meal Image */}
      <div className="h-44 w-full bg-slate-100 flex items-center justify-center relative overflow-hidden rounded-t-2xl">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={meal.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-food/5" />
            <svg className="h-16 w-16 text-slate-200 group-hover:scale-110 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </>
        )}

        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <Badge variant="info">{mealType}</Badge>
          {statusBadge}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-slate-900 leading-tight">
              {meal.name}
            </h3>
          </div>
          
          {meal.description ? (
            <p className="text-sm text-slate-500 line-clamp-3 mb-4">
              {meal.description}
            </p>
          ) : (
            <p className="text-sm italic text-slate-400 mb-4">
              No description available for this delicious meal.
            </p>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between gap-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Available today
          </div>
          <Button
            onClick={() => onReserve(menuMeal.id)}
            disabled={disabled}
            variant={isExactReserved || isSameTypeReserved ? "secondary" : "primary"}
            size="md"
            className="flex-shrink-0"
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </Card>
  );
}