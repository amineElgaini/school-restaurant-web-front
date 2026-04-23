import Button from "../ui/Button";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import type { Meal } from "../../types/meal";

type Props = {
  meal: Meal;
  onDelete: (mealId: number) => void;
  onEdit: (meal: Meal) => void;
};

export default function MealManagementCard({ meal, onDelete, onEdit }: Props) {
  const imageUrl = meal.image
    ? `http://localhost:8000/storage/${meal.image}`
    : null;

  return (
    <Card hover className="flex flex-col h-full group">
      {/* Meal Image */}
      <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={meal.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-300">
            <svg className="h-16 w-16 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        <div className="absolute top-3 left-3">
          <Badge variant="info">
            {meal.meal_type?.name ?? "Main Dish"}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="mb-4 flex-1">
          <h3 className="text-xl font-bold bg-clip-text text-slate-900 group-hover:text-primary-700 transition-colors">
            {meal.name}
          </h3>
          <p className="mt-2 text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {meal.description || "No specific details provided for this meal item."}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-50 flex items-center justify-between gap-3">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            ID: #{meal.id}
          </div>
          <div className="flex gap-2">
            <Button 
               variant="secondary" 
               size="sm" 
               className="h-9 w-9 p-0"
               title="Edit Meal"
               onClick={() => onEdit(meal)}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-9 w-9 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={() => onDelete(meal.id)}
              title="Delete Meal"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}