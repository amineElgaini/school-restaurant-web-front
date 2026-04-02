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

type MenuMeal = {
  id: number;
  meal_id: number;
  served_at: string;
  meal: Meal;
};

function getNextWeekDays() {
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const today = new Date();
  const days: { label: string; value: string }[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const value = date.toISOString().split("T")[0];
    const label = `${formatter.format(date)} (${value})`;

    days.push({ label, value });
  }

  return days;
}

export default function MenuPage() {
  const dayOptions = useMemo(() => getNextWeekDays(), []);
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
      const category = meal.meal_type?.name || "Other";

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
      } else {
        await createMenuMealApi({
          meal_id: selectedMeal.id,
          served_at: selectedDate,
        });
      }

      await fetchData();
      closeActionModal();
    } catch (error) {
      console.error("Failed to update menu meal", error);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Plan Menu</h1>
          <p className="text-gray-600">
            Select a day and add or remove meals from that menu.
          </p>
        </div>

        <DaySelector
          value={selectedDate}
          onChange={setSelectedDate}
          options={dayOptions}
        />
      </div>

      {loading ? (
        <p>Loading meals...</p>
      ) : Object.keys(mealsGroupedByType).length === 0 ? (
        <div className="rounded-xl border bg-white p-6 text-gray-500">
          No meals found.
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(mealsGroupedByType).map(([category, categoryMeals]) => (
            <section key={category} className="space-y-4">
              <h2 className="text-xl font-semibold">{category}</h2>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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

      <MenuActionModal
        open={modalOpen}
        meal={selectedMeal}
        planned={selectedMealPlanned}
        loading={actionLoading}
        onClose={closeActionModal}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}