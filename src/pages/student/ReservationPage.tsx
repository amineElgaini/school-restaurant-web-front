import { useEffect, useMemo, useState } from "react";
import Button from "../../components/ui/Button";
import ReservationCard from "../../components/reservations/ReservationCard";
import ComplaintModal from "../../components/reservations/ComplaintModal";
import MealCard from "../../components/meals/MealCard";
import Card from "../../components/ui/Card";
import {
  getMyReservationsApi,
  removeReservationApi,
  reserveMealApi,
  submitComplaintApi,
} from "../../api/student.api.ts";
import { getMenuMealsByDateApi } from "../../api/menuMeals.api";
import type { MenuMeal, Reservation } from "../../types/reservation";

export default function ReservationPage() {
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
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
    [reservations],
  );

  const reservedMealTypeIds = useMemo(
    () =>
      reservations.map(
        (reservation) => reservation.menu_meal.meal.meal_type_id,
      ),
    [reservations],
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

  const handleSubmitComplaint = async (
    subject: string,
    description: string,
  ) => {
    try {
      await submitComplaintApi({ subject, description });
    } catch (error) {
      console.error("Failed to submit complaint", error);
      throw error;
    }
  };

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-slate-100 pb-8">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight font-display">
            Meal Reservations
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Browse today's menu and secure your spot at the cafeteria.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <span className="absolute -top-3 left-3 bg-white px-1 text-xs font-bold text-slate-400 group-focus-within:text-primary-600 transition-colors">
              Select Date
            </span>
            <input
              type="date"
              className="rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-slate-900 shadow-sm transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <Button 
            variant="outline" 
            size="lg"
            onClick={() => setComplaintOpen(true)}
            className="shadow-sm"
          >
            <svg className="mr-2 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Report Issue
          </Button>
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-3">
        {/* Left 2 Cols: Menu */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-food/10 text-accent-food">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </span>
              Available Menu
            </h2>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          ) : menuMeals.length === 0 ? (
            <Card className="flex flex-col items-center justify-center py-20 text-center border-dashed bg-slate-50/50">
              <div className="mb-4 rounded-full bg-slate-100 p-4">
                <svg className="h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900">No Meals Available</h3>
              <p className="mt-1 text-slate-500">There are no menu items listed for {new Date(date).toLocaleDateString()}.</p>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {menuMeals.map((menuMeal) => {
                const isExactReserved = reservedMenuMealIds.includes(menuMeal.id);
                const isSameTypeReserved = reservedMealTypeIds.includes(menuMeal.meal.meal_type_id);

                return (
                  <MealCard
                    key={menuMeal.id}
                    menuMeal={menuMeal}
                    isExactReserved={isExactReserved}
                    isSameTypeReserved={isSameTypeReserved}
                    onReserve={handleReserve}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: My Reservations */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </span>
            My Orders
          </h2>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          ) : reservations.length === 0 ? (
            <Card className="flex flex-col items-center justify-center py-12 text-center border-dashed bg-slate-50/50">
              <p className="text-slate-400 font-medium italic">No reservations yet.</p>
            </Card>
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
          
          <div className="mt-8 rounded-2xl bg-primary-900 p-6 text-white shadow-xl shadow-primary-900/20">
            <h4 className="flex items-center gap-2 font-bold mb-2">
              <svg className="h-5 w-5 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Student Tip
            </h4>
            <p className="text-sm text-primary-100 leading-relaxed">
              Remember to cancel your reservation at least 2 hours before serving time if you can't make it. This helps reduce food waste!
            </p>
          </div>
        </div>
      </div>

      <ComplaintModal
        isOpen={complaintOpen}
        onClose={() => setComplaintOpen(false)}
        onSubmit={handleSubmitComplaint}
      />
    </div>
  );
}
