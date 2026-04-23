import { useEffect, useMemo, useState } from "react";
import type { Meal } from "../../types/meal";
import { getMealsApi } from "../../api/meals.api";
import {
  createMenuMealApi,
  deleteMenuMealApi,
  getMenuMealsByDateApi,
} from "../../api/menuMeals.api";
import DaySelector from "../../components/menu/DaySelector";
import MenuMealCard from "../../components/menu/MenuMealCard";
import MenuActionModal from "../../components/menu/MenuActionModal";
import Badge from "../../components/ui/Badge";
import toast from "react-hot-toast";

import { getNextWeekWorkDays } from "../../utils/date";

type MenuMeal = {
  id: number;
  meal_id: number;
  served_at: string;
  meal: Meal;
};

export default function MenuPage() {
  const dayOptions = useMemo(() => getNextWeekWorkDays(), []);
  const [selectedDate, setSelectedDate] = useState(dayOptions[0]?.value ?? "");

  const [meals, setMeals] = useState<Meal[]>([]);
  const [menuMeals, setMenuMeals] = useState<MenuMeal[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [selectedMealPlanned, setSelectedMealPlanned] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [mealsData, menuMealsData] = await Promise.all([
        getMealsApi(),
        getMenuMealsByDateApi(selectedDate),
      ]);

      setMeals(mealsData);
      setMenuMeals(menuMealsData);
    } catch (error) {
      console.error("Failed to fetch menu page data", error);
      toast.error("Failed to load menu data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedDate) return;
    fetchData();
  }, [selectedDate]);

  const plannedMealIds = useMemo(
    () => menuMeals.map((menuMeal) => menuMeal.meal_id),
    [menuMeals]
  );

  const mealsGroupedByType = useMemo(() => {
    return meals.reduce<Record<string, Meal[]>>((acc, meal) => {
      const category = meal.meal_type?.name || "Uncategorized";

      if (!acc[category]) {
        acc[category] = [];
      }

      acc[category].push(meal);
      return acc;
    }, {});
  }, [meals]);

  const openActionModal = (meal: Meal, planned: boolean) => {
    setSelectedMeal(meal);
    setSelectedMealPlanned(planned);
    setModalOpen(true);
  };

  const closeActionModal = () => {
    setModalOpen(false);
    setSelectedMeal(null);
    setSelectedMealPlanned(false);
  };

  const handleConfirmAction = async () => {
    if (!selectedMeal) return;

    try {
      setActionLoading(true);

      if (selectedMealPlanned) {
        const targetMenuMeal = menuMeals.find(
          (item) => item.meal_id === selectedMeal.id
        );

        if (!targetMenuMeal) return;

        await deleteMenuMealApi(targetMenuMeal.id);
        toast.success(`${selectedMeal.name} removed from menu`);
      } else {
        await createMenuMealApi({
          meal_id: selectedMeal.id,
          served_at: selectedDate,
        });
        toast.success(`${selectedMeal.name} added to menu`);
      }

      await fetchData();
      closeActionModal();
    } catch (error) {
      console.error("Failed to update menu meal", error);
      toast.error("Error updating menu selection");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between border-b border-slate-100 pb-8">
        <div className="space-y-2">
          <Badge variant="info">Staff Management</Badge>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight font-display">
            Weekly Menu Planner
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Plan, modify, and manage the cafeteria menu for upcoming days.
          </p>
        </div>

        <DaySelector
          value={selectedDate}
          onChange={setSelectedDate}
          options={dayOptions}
        />
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {loading ? (
          <div className="space-y-12">
            {[1, 2].map((group) => (
              <div key={group} className="space-y-6">
                <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-100" />
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-64 animate-pulse rounded-2xl bg-slate-100" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : Object.keys(mealsGroupedByType).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <h3 className="text-2xl font-bold text-slate-900">No Meals to Plan</h3>
            <p className="mt-2 text-slate-500 max-w-sm">Please add meals to the archive before you can plan a menu.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {Object.entries(mealsGroupedByType).map(([category, categoryMeals]) => (
              <section key={category} className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-slate-900">{category}</h2>
                  <div className="h-px flex-1 bg-slate-100" />
                  <Badge variant="neutral">{categoryMeals.length} Total</Badge>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {categoryMeals.map((meal) => (
                    <MenuMealCard
                      key={meal.id}
                      meal={meal}
                      planned={plannedMealIds.includes(meal.id)}
                      onAction={openActionModal}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <MenuActionModal
        isOpen={modalOpen}
        meal={selectedMeal}
        planned={selectedMealPlanned}
        loading={actionLoading}
        onClose={closeActionModal}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}