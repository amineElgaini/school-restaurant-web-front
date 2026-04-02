import { useEffect, useState } from "react";
import SearchInput from "../../components/ui/SearchInput";
import UsersReservationTable from "../../components/reservations/UsersReservationTable";
import UserReservationDetailsModal from "../../components/reservations/UserReservationDetailsModal";
import { getReservationUsersApi } from "../../api/reservations.api";
import type { ReservationUser } from "../../types/staffReservation";

export default function ReservationsPage() {
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<ReservationUser[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState<ReservationUser | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const fetchUsers = async (targetDate: string, targetSearch = "") => {
    try {
      setLoading(true);
      const data = await getReservationUsersApi(targetDate, targetSearch);
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch reservation users", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchUsers(date, search);
    }, 300);

    return () => clearTimeout(timeout);
  }, [date, search]);

  const handleOpenDetails = (user: ReservationUser) => {
    setSelectedUser(user);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reservations</h1>
        <p className="text-gray-600">
          Choose a date, search users, and view their reservation details.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Select date
          </label>
          <input
            type="date"
            className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <SearchInput
          label="Search user"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <div className="rounded-xl border bg-white p-6 text-gray-500">
          No users found for this date.
        </div>
      ) : (
        <UsersReservationTable users={users} onDetails={handleOpenDetails} />
      )}

      <UserReservationDetailsModal
        open={detailsOpen}
        user={selectedUser}
        date={date}
        onClose={handleCloseDetails}
      />
    </div>
  );
}