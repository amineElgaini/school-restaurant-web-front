import { useEffect, useMemo, useState } from "react";
import Button from "../../components/ui/Button";
import ReservationCard from "../../components/reservations/ReservationCard";
import ComplaintModal from "../../components/reservations/ComplaintModal";
import MealCard from "../../components/meals/MealCard";
import {
  getMyReservationsApi,
  removeReservationApi,
  reserveMealApi,
  submitComplaintApi,
} from "../../api/student.api.ts";
import { getMenuMealsByDateApi } from "../../api/menuMeals.api";
import type { MenuMeal, Reservation } from "../../types/reservation";

export default function ReservationPage() {
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [menuMeals, setMenuMeals] = useState<MenuMeal[]>([]);
  const [loading, setLoading] = useState(false);
  const [complaintOpen, setComplaintOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);

    try {
      const [reservationsData, menuMealsData] = await Promise.all([
        getMyReservationsApi(date),
        getMenuMealsByDateApi(date),
      ]);

      setReservations(reservationsData);
      setMenuMeals(menuMealsData);
    } catch (error) {
      console.error("Failed to fetch reservation page data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [date]);

  const reservedMenuMealIds = useMemo(
    () => reservations.map((reservation) => reservation.menu_meal.id),
    [reservations]
  );

  const reservedMealTypeIds = useMemo(
    () =>
      reservations.map(
        (reservation) => reservation.menu_meal.meal.meal_type_id
      ),
    [reservations]
  );

  const handleReserve = async (menuMealId: number) => {
    try {
      await reserveMealApi(menuMealId);
      await fetchData();
    } catch (error) {
      console.error("Failed to reserve meal", error);
    }
  };

  const handleRemoveReservation = async (reservationId: number) => {
    try {
      await removeReservationApi(reservationId);
      await fetchData();
    } catch (error) {
      console.error("Failed to remove reservation", error);
    }
  };

  const handleSubmitComplaint = async (subject: string, description: string) => {
    try {
      await submitComplaintApi({ subject, description });
    } catch (error) {
      console.error("Failed to submit complaint", error);
      throw error;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reservations</h1>
          <p className="text-gray-600">
            Reserve meals and manage your reservations for a selected day.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            className="rounded-xl border px-3 py-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <Button variant="secondary" onClick={() => setComplaintOpen(true)}>
            Submit Complaint
          </Button>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Available Meals</h2>

        {loading ? (
          <p>Loading available meals...</p>
        ) : menuMeals.length === 0 ? (
          <div className="rounded-xl border bg-white p-6 text-gray-500">
            No meals available for this date.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {menuMeals.map((menuMeal) => {
              const alreadyReservedExact = reservedMenuMealIds.includes(menuMeal.id);
              const alreadyReservedSameType = reservedMealTypeIds.includes(
                menuMeal.meal.meal_type_id
              );

              return (
                <MealCard
                  key={menuMeal.id}
                  menuMeal={menuMeal}
                  reserved={alreadyReservedExact || alreadyReservedSameType}
                  onReserve={handleReserve}
                />
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">My Reserved Meals</h2>

        {loading ? (
          <p>Loading reservations...</p>
        ) : reservations.length === 0 ? (
          <div className="rounded-xl border bg-white p-6 text-gray-500">
            No reservations found for this date.
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onRemove={handleRemoveReservation}
              />
            ))}
          </div>
        )}
      </section>

      <ComplaintModal
        open={complaintOpen}
        onClose={() => setComplaintOpen(false)}
        onSubmit={handleSubmitComplaint}
      />
    </div>
  );
}