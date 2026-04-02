import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import type {
  ReservationUser,
  UserReservationItem,
} from "../../types/staffReservation";
import { getUserReservationsByDateApi } from "../../api/reservations.api.ts";
import ReservationDetailCard from "./ReservationDetailCard";

type Props = {
  open: boolean;
  user: ReservationUser | null;
  date: string;
  onClose: () => void;
};

export default function UserReservationDetailsModal({
  open,
  user,
  date,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState<UserReservationItem[]>([]);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!open || !user || !date) return;

      try {
        setLoading(true);
        const data = await getUserReservationsByDateApi(user.id, date);
        setReservations(data?.reservations);
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
    if (!open) {
      setReservations([]);
    }
  }, [open]);

  return (
    <Modal
      open={open}
      title={user ? `${user.name} Reservations` : "Reservation Details"}
      onClose={onClose}
    >
      {!user ? null : (
        <div className="space-y-4">
          <div className="rounded-xl bg-gray-50 p-3">
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="mt-1 text-sm text-gray-500">Date: {date}</p>
          </div>

          {loading ? (
            <p>Loading reservations...</p>
          ) : reservations.length === 0 ? (
            <div className="rounded-xl border bg-white p-4 text-sm text-gray-500">
              No reservations found for this date.
            </div>
          ) : (
            <div className="space-y-3">
              {reservations.map((reservation) => (
                <ReservationDetailCard
                  key={reservation.id}
                  reservation={reservation}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
