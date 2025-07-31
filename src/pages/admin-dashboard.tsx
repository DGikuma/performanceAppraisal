import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Progress,
  Tabs,
  Tab,
} from "@heroui/react";
import clsx from "clsx";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/dashboard-layout";
import DashboardLoader from "../components/DashboardLoader";
import { useAuth } from "../contexts/auth-context";
import ThemeToggle from "../components/themeToggle";
import Lottie from "lottie-react";
import androidBotAnimation from "../assets/androidBot.json";

const AdminDashboard: React.FC = () => {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [activity, setActivity] = useState<any>({ appraisals: [], users: [] });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchActivity = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/dashboard/activity", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setActivity(data);
      } catch (error) {
        console.error("Failed to fetch activity", error);
      }
    };

    if (token) {
      fetchStats();
      fetchActivity();
    }
  }, [token]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "danger";
      case "supervisor": return "primary";
      case "employee": return "success";
      default: return "default";
    }
  };

  if (loading) return <DashboardLoader />;

  return (
    <DashboardLayout title="Admin Dashboard">
            <div className="flex justify-between items-center mb-4">
              <ThemeToggle />
              </div>
      {/* Title */}
      <section className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Control panel & system insights</p>
      </section>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          {
            icon: "lucide:users",
            label: "Total Employees",
            value: stats?.systemStats?.totalemployees || 0,
            color: "bg-blue-100 text-blue-600",
          },
          {
            icon: "lucide:check-circle",
            label: "Completed Reviews",
            value: stats?.systemStats?.completedappraisals || 0,
            color: "bg-green-100 text-green-600",
          },
          {
            icon: "lucide:clock",
            label: "Pending Reviews",
            value: stats?.systemStats?.pendingappraisals || 0,
            color: "bg-yellow-100 text-yellow-600",
          },
          {
            icon: "lucide:building",
            label: "Departments",
            value: stats?.systemStats?.totaldepartments || 0,
            color: "bg-purple-100 text-purple-600",
          },
        ].map((stat, i) => (
          <Card key={i} className="shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
            <CardBody className="flex items-center">
              <div className={`p-4 rounded-full ${stat.color} shadow`}>
                <Icon icon={stat.icon} className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Users & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Recent Users */}
        <Card className="shadow-xl rounded-2xl">
          <CardHeader className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-semibold text-gray-800">Recently Added Users</h2>
          <Button
            as={Link}
            to="/admin/employees"
            className="group inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl bg-blue-600 text-white shadow-md transition-all duration-200 hover:bg-red-700 hover:shadow-lg active:scale-95"
            size="sm"
          >
            View All
            <Icon
              icon="lucide:arrow-right"
              className="text-lg transition-transform duration-200 group-hover:translate-x-1"
            />
          </Button>
          </CardHeader>
          <CardBody className="p-0">
            <Table removeWrapper isStriped aria-label="recent-users">
              <TableHeader>
                <TableColumn>NAME</TableColumn>
                <TableColumn>DEPARTMENT</TableColumn>
                <TableColumn>ROLE</TableColumn>
                <TableColumn>JOINED</TableColumn>
              </TableHeader>
              <TableBody>
                {stats?.recentUsers?.length > 0 ? (
                  stats.recentUsers.map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>
                        <Chip size="sm" color={getRoleColor(user.role)} variant="flat">
                          {user.role}
                        </Chip>
                      </TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Lottie animationData={androidBotAnimation} style={{ width: 180 }} loop />
                        <p className="mt-2 text-sm text-gray-500">No users found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        {/* System Activity */}
        <Card className="shadow-2xl rounded-2xl bg-white">
          <CardHeader className="border-b border-gray-200 pb-3 px-6 pt-5">
            <h2 className="text-xl font-bold text-gray-900">System Activity</h2>
          </CardHeader>
          <CardBody className="px-6 py-4">
            <Tabs
              aria-label="Activity"
              variant="underlined"
              classNames={{
                tabList: "flex gap-4 border-b border-gray-200",
                tab: "relative text-sm font-semibold px-1 pb-2 text-gray-500 transition-all hover:text-blue-500",
                panel: "py-3",
              }}
            >
              <Tab key="appraisals" title="Appraisals">
                {activity.appraisals.length > 0 ? (
                  activity.appraisals.map((a: any, i: number) => (
                    <ActivityItem
                      key={i}
                      icon="lucide:file-check"
                      color={
                        a.status === "completed"
                          ? "text-green-600"
                          : a.status === "supervisor_review"
                          ? "text-blue-600"
                          : "text-yellow-600"
                      }
                      text={`${a.employee_name} appraisal marked as ${a.status.replace('_', ' ')}`}
                      time={new Date(a.updated_at).toLocaleString()}
                    />
                  ))
                ) : (
                    <div className="flex flex-col items-center justify-center">
                      <Lottie animationData={androidBotAnimation} style={{ width: 180 }} loop />
                      <p className="mt-2 text-sm text-gray-500">No Recent Appraisals</p>
                    </div>
                )}
              </Tab>
              <Tab key="users" title="Users">
                {activity.users.length > 0 ? (
                  activity.users.map((u: any, i: number) => (
                    <ActivityItem
                      key={i}
                      icon="lucide:user-plus"
                      color="text-green-600"
                      text={`${u.name} (${u.role}) registered`}
                      time={new Date(u.created_at).toLocaleString()}
                    />
                  ))
                ) : (
                    <div className="flex flex-col items-center justify-center">
                      <Lottie animationData={androidBotAnimation} style={{ width: 180 }} loop />
                      <p className="mt-2 text-sm text-gray-500">No Recent Users</p>
                    </div>
                )}
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>

      {/* Department Performance */}
      <Card className="shadow-xl rounded-2xl">
        <CardHeader className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-semibold text-gray-800">Department Performance</h2>
          <Button
            as={Link}
            to="/admin/departments"
            className="group inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl bg-blue-600 text-white shadow-md transition-all duration-200 hover:bg-red-700 hover:shadow-lg active:scale-95"
            size="sm"
          >
            View All
            <Icon
              icon="lucide:arrow-right"
              className="text-lg transition-transform duration-200 group-hover:translate-x-1"
            />
          </Button>
        </CardHeader>
        <CardBody className="p-0">
          <Table removeWrapper isStriped>
            <TableHeader>
              <TableColumn>DEPARTMENT</TableColumn>
              <TableColumn>EMPLOYEES</TableColumn>
              <TableColumn>COMPLETION</TableColumn>
              <TableColumn>AVG. RATING</TableColumn>
            </TableHeader>
            <TableBody>
              {stats?.departmentStats?.length > 0 ? (
                stats.departmentStats.map((dept: any) => (
                  <TableRow key={dept.department}>
                    <TableCell>{dept.department}</TableCell>
                    <TableCell>{dept.employees}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={dept.completionrate} size="sm" className="w-full max-w-xs" />
                        <span className="text-sm">{dept.completionrate}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">{dept.avgrating}</span>
                        <div className="flex text-yellow-500">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Icon
                              key={star}
                              icon={star <= Math.round(dept.avgrating) ? "lucide:star" : "lucide:star-off"}
                              className="w-4 h-4"
                            />
                          ))}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Lottie animationData={androidBotAnimation} style={{ width: 180 }} loop />
                      <p className="mt-2 text-sm text-gray-500">No department data available</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </DashboardLayout>
  );
};

  type ActivityItemProps = {
    icon: string;
    color: string;
    text: string;
    time: string;
  };

  const ActivityItem: React.FC<ActivityItemProps> = ({ icon, color, text, time }) => (
    <div className="flex items-start gap-4">
      <div className={clsx("rounded-full bg-gray-100 p-2 shadow-sm", color)}>
        <Icon icon={icon} className="text-xl" />
      </div>
      <div className="flex flex-col text-sm text-gray-700">
        <span className="font-medium">{text}</span>
        <span className="text-xs text-gray-500">{time}</span>
      </div>
    </div>
  );

export default AdminDashboard;
