import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import type {
  ReservationUser,
  UserReservationItem,
} from "../../types/staffReservation";
import { getUserReservationsByDateApi } from "../../api/reservations.api.ts";
import ReservationDetailCard from "./ReservationDetailCard";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

type Props = {
  isOpen: boolean;
  user: ReservationUser | null;
  date: string;
  onClose: () => void;
};

export default function UserReservationDetailsModal({
  isOpen,
  user,
  date,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState<UserReservationItem[]>([]);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!isOpen || !user || !date) return;

      try {
        setLoading(true);
        const data = await getUserReservationsByDateApi(user.id, date);
        setReservations(data?.reservations || []);
      } catch (error) {
        console.error("Failed to fetch user reservations", error);
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [open, user, date]);

  useEffect(() => {
    if (!isOpen) {
      setReservations([]);
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      title="Attendance Details"
      onClose={onClose}
    >
      {!user ? null : (
        <div className="space-y-8 pt-2">
          {/* User Header Info */}
          <div className="flex items-center gap-5 p-5 rounded-3xl bg-slate-50 border border-slate-100">
             {user.image ? (
                <img
                  src={`http://localhost:8000/storage/${user.image}`}
                  alt={user.name}
                  className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-sm"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-bold border-2 border-white shadow-sm text-xl">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900">{user.name}</h3>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
              <Badge variant="neutral">
                {new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </Badge>
          </div>

          <div className="space-y-4">
            <h4 className="px-1 text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Meal Reservations
            </h4>

            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-24 w-full animate-pulse rounded-2xl bg-slate-50" />
                ))}
              </div>
            ) : reservations.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-slate-100 px-6 py-10 text-center">
                <p className="text-sm text-slate-400 italic font-medium">No reservations found for this student on this date.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <ReservationDetailCard
                    key={reservation.id}
                    reservation={reservation}
                  />
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-end pt-4 border-t border-slate-100">
             <Button variant="ghost" onClick={onClose} className="font-bold text-slate-500">
               Close Panel
             </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
