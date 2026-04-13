import { useEffect, useState } from "react";
import SearchInput from "../../components/ui/SearchInput";
import UsersReservationTable from "../../components/reservations/UsersReservationTable";
import UserReservationDetailsModal from "../../components/reservations/UserReservationDetailsModal";
import { getReservationUsersApi } from "../../api/reservations.api";
import type { ReservationUser } from "../../types/staffReservation";
import Badge from "../../components/ui/Badge";
import Card from "../../components/ui/Card";
import toast from "react-hot-toast";

export default function ReservationsPage() {
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<ReservationUser[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState<ReservationUser | null>(null);

  const fetchUsers = async (targetDate: string, targetSearch = "") => {
    try {
      setLoading(true);
      const data = await getReservationUsersApi(targetDate, targetSearch);
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch reservation users", error);
      toast.error("Failed to load reservations");
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
  };

  const handleCloseDetails = () => {
    setSelectedUser(null);
  };

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-slate-100 pb-8">
        <div className="space-y-2">
          <Badge variant="success">Live Monitoring</Badge>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight font-display">
            Daily Reservations
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Monitor and manage student meal attendance for any selected day.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 min-w-[300px] lg:min-w-[450px]">
          <div className="w-full relative group">
            <span className="absolute -top-3 left-3 bg-white px-1 text-xs font-bold text-slate-400 group-focus-within:text-primary-600 transition-colors">
              Attendance Date
            </span>
            <input
              type="date"
              className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-slate-900 shadow-sm transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <SearchInput
            placeholder="Search by student name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="shadow-sm"
          />
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {loading ? (
          <div className="space-y-4">
            <div className="h-14 w-full animate-pulse rounded-xl bg-slate-100" />
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-20 w-full animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <div className="mb-6 rounded-full bg-slate-100 p-6 text-slate-300">
              <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">No Reservations Recorded</h3>
            <p className="mt-2 text-slate-500 max-w-sm">
              We couldn't find any meal reservations for <strong>{new Date(date).toLocaleDateString()}</strong>.
              {search && " Try a different search term."}
            </p>
          </Card>
        ) : (
          <div className="rounded-3xl border border-slate-200/60 overflow-hidden bg-white shadow-xl shadow-slate-200/20">
            <UsersReservationTable users={users} onDetails={handleOpenDetails} />
          </div>
        )}
      </div>

      <UserReservationDetailsModal
        isOpen={!!selectedUser}
        user={selectedUser}
        date={date}
        onClose={handleCloseDetails}
      />
    </div>
  );
}