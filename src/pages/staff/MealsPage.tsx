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

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [mealTypes, setMealTypes] = useState<MealType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const data = await getMealsApi();
      setMeals(data);
    } catch (error) {
      console.error("Failed to fetch meals", error);
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
    try {
      await deleteMealApi(mealId);
      await fetchMeals();
    } catch (error) {
      console.error("Failed to delete meal", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Meals</h1>
          <p className="text-gray-600">
            Create meals and manage existing ones.
          </p>
        </div>

        <Button onClick={() => setModalOpen(true)}>Add Meal</Button>
      </div>

      {loading ? (
        <p>Loading meals...</p>
      ) : meals.length === 0 ? (
        <div className="rounded-xl border bg-white p-6 text-gray-500">
          No meals found.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {meals.map((meal) => (
            <MealManagementCard
              key={meal.id}
              meal={meal}
              onDelete={handleDeleteMeal}
            />
          ))}
        </div>
      )}

      <AddMealModal
        open={modalOpen}
        mealTypes={mealTypes}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchMeals}
      />
    </div>
  );
}