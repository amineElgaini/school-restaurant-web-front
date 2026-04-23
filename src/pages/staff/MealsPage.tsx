import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import MealManagementCard from "../../components/meals/MealManagementCard";
import AddMealModal from "../../components/meals/AddMealModal";
import {
  deleteMealApi,
  getMealTypesApi,
  getMealsApi,
} from "../../api/meals.api";
import type { Meal, MealType } from "../../types/meal";
import toast from "react-hot-toast";

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [mealTypes, setMealTypes] = useState<MealType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const data = await getMealsApi();
      setMeals(data);
    } catch (error) {
      console.error("Failed to fetch meals", error);
      toast.error("Failed to load meals list");
    } finally {
      setLoading(false);
    }
  };

  const fetchMealTypes = async () => {
    try {
      const data = await getMealTypesApi();
      setMealTypes(data);
    } catch (error) {
      console.error("Failed to fetch meal types", error);
    }
  };

  useEffect(() => {
    fetchMeals();
    fetchMealTypes();
  }, []);

  const handleDeleteMeal = async (mealId: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this meal?");
    if (!confirmed) return;

    try {
      await deleteMealApi(mealId);
      toast.success("Meal deleted successfully");
      await fetchMeals();
    } catch (error) {
      console.error("Failed to delete meal", error);
      toast.error("Failed to delete meal");
    }
  };

  const handleEditMeal = (meal: Meal) => {
    setEditingMeal(meal);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingMeal(null);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-8">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight font-display">
            Meal Archive
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Create and manage the master list of dishes available in your cafeteria.
          </p>
        </div>

        <Button 
          size="lg" 
          onClick={() => { setEditingMeal(null); setModalOpen(true); }}
          className="shadow-md shadow-primary-500/20"
        >
          <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Dish
        </Button>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 w-full animate-pulse rounded-3xl bg-slate-100" />
            ))}
          </div>
        ) : meals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <div className="mb-6 rounded-full bg-slate-100 p-6 text-slate-300">
              <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Archive is Empty</h3>
            <p className="mt-2 text-slate-500 max-w-sm">Start by adding your first dish to the cafeteria's meal archive.</p>
            <Button 
              variant="outline" 
              className="mt-8"
              onClick={() => { setEditingMeal(null); setModalOpen(true); }}
            >
              Add First Meal
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {meals.map((meal) => (
              <MealManagementCard
                key={meal.id}
                meal={meal}
                onDelete={handleDeleteMeal}
                onEdit={handleEditMeal}
              />
            ))}
          </div>
        )}
      </div>

      <AddMealModal
        isOpen={modalOpen}
        meal={editingMeal}
        mealTypes={mealTypes}
        onClose={handleCloseModal}
        onSuccess={fetchMeals}
      />
    </div>
  );
}