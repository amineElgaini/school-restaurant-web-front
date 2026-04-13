import Button from "../ui/Button";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
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
    <Card hover className={`flex flex-col h-full group ${planned ? "border-primary-200 bg-primary-50/10" : "border-slate-200/60"}`}>
      {/* Meal Image */}
      <div className="h-40 w-full relative overflow-hidden bg-slate-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={meal.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300">
             <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        <div className="absolute top-3 left-3 flex gap-2">
          {planned && <Badge variant="success">Planned</Badge>}
          <Badge variant="neutral">{meal.meal_type?.name || "Main Dish"}</Badge>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="mb-4 flex-1">
          <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-primary-700 transition-colors">
            {meal.name}
          </h3>
          <p className="mt-1 text-xs text-slate-500 line-clamp-2">
            {meal.description || "No description provided."}
          </p>
        </div>

        <Button
          variant={planned ? "outline" : "primary"}
          size="sm"
          className="w-full"
          onClick={() => onAction(meal, planned)}
        >
          {planned ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Remove from Menu
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add to Menu
            </span>
          )}
        </Button>
      </div>
    </Card>
  );
}