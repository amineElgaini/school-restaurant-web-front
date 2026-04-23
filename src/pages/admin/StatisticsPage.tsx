import { useEffect, useState } from "react";
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  Utensils, 
  UserCheck,
  AlertCircle,
  Clock
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  CartesianGrid
} from "recharts";
import { adminApi, type AdminStatistics } from "../../api/admin.api";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { format } from "date-fns";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444"];

export default function StatisticsPage() {
  const [stats, setStats] = useState<AdminStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await adminApi.getStatistics();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!stats) return null;

  const userDistribution = [
    { name: "Students", value: stats.users.students },
    { name: "Staff", value: stats.users.staff },
    { name: "Admins", value: stats.users.admins },
  ];

  const complaintData = [
    { name: "Pending", count: stats.complaints.pending },
    { name: "Resolved", count: stats.complaints.resolved },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="mt-2 text-slate-500">Real-time insights and system statistics.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-center gap-4 p-6 overflow-hidden relative">
          <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Users</p>
            <p className="text-2xl font-bold text-slate-900">{stats.users.total}</p>
          </div>
          <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-indigo-50/50 rounded-full" />
        </Card>

        <Card className="flex items-center gap-4 p-6 overflow-hidden relative">
          <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Today's Reservations</p>
            <p className="text-2xl font-bold text-slate-900">{stats.reservations.today}</p>
          </div>
          <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-emerald-50/50 rounded-full" />
        </Card>

        <Card className="flex items-center gap-4 p-6 overflow-hidden relative">
          <div className="rounded-2xl bg-amber-50 p-3 text-amber-600">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pending Complaints</p>
            <p className="text-2xl font-bold text-slate-900">{stats.complaints.pending}</p>
          </div>
          <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-amber-50/50 rounded-full" />
        </Card>

        <Card className="flex items-center gap-4 p-6 overflow-hidden relative">
          <div className="rounded-2xl bg-rose-50 p-3 text-rose-600">
            <Utensils className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Meals</p>
            <p className="text-2xl font-bold text-slate-900">{stats.meals.total}</p>
          </div>
          <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-rose-50/50 rounded-full" />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* User Distribution Chart */}
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-indigo-500" />
              User Distribution
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                  }} 
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Complaint Status Chart */}
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-rose-500" />
              Complaint Status
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complaintData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                  }} 
                />
                <Bar 
                  dataKey="count" 
                  fill="#6366f1" 
                  radius={[8, 8, 0, 0]} 
                  barSize={60} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="h-5 w-5 text-emerald-500" />
            Recent Reservations
          </h3>
        </div>
        <div className="divide-y divide-slate-100">
          {stats.recent_activity.length > 0 ? (
            stats.recent_activity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50/50">
                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                  {activity.user_image ? (
                    <img src={activity.user_image} alt={activity.user_name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-500 font-bold">
                      {activity.user_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {activity.user_name}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Utensils className="h-3 w-3" />
                    Reserved <span className="font-semibold text-slate-700">{activity.meal_name}</span> for {format(new Date(activity.served_at), 'PPP')}
                  </p>
                </div>
                <Badge variant="info" className="hidden sm:inline-flex">
                  {format(new Date(activity.created_at), 'p')}
                </Badge>
              </div>
            ))
          ) : (
            <div className="px-6 py-10 text-center">
              <p className="text-slate-500 italic">No recent reservation activity found.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
