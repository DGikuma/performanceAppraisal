import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/dashboard-layout";
import DashboardLoader from "../components/DashboardLoader";
import { useAuth } from "../contexts/auth-context";
import ThemeToggle from "../components/themeToggle";
import Lottie from "lottie-react";
import androidBotAnimation from "../assets/androidBot.json";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SupervisorDashboard: React.FC = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const checkMaintenanceMode = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await axios.get('http://localhost:5000/api/settings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        return res.data;
      } catch (err) {
        console.error('⚠️ Failed to check maintenance mode:', err);
      }
    };

    if (token) {
      checkMaintenanceMode();
    }
  }, [token, user, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
      const res = await fetch("http://localhost:5000/api/supervisor/supervisor_dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const contentType = res.headers.get("content-type");

      if (!res.ok || !contentType?.includes("application/json")) {
        const text = await res.text(); // Fallback if response is HTML or error page
        console.error("Non-JSON response:", text);
        throw new Error(`HTTP ${res.status} - ${text}`);
      }

      const data = await res.json();
      setDashboardData(data);

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "success";
      case "in-progress": return "primary";
      case "pending": return "warning";
      default: return "default";
    }
  };

  if (loading) {
    return <DashboardLoader />;
  }

  return (
    <DashboardLayout title="Supervisor Dashboard">
      <div className="flex justify-between items-center mb-4">
        <ThemeToggle />
        </div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 hidden md:block">Supervisor Dashboard</h1>
        <p className="text-gray-600 mt-1 hidden md:block">
          Manage your team's performance appraisals and reviews
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[{
          icon: "lucide:users", color: "primary", label: "Team Size", value: dashboardData?.departmentStats?.teamSize || 0
        }, {
          icon: "lucide:check-circle", color: "success", label: "Completed Reviews", value: dashboardData?.departmentStats?.completedAppraisals || 0
        }, {
          icon: "lucide:clock", color: "warning", label: "Pending Reviews", value: dashboardData?.departmentStats?.pendingAppraisals || 0
        }, {
          icon: "lucide:star", color: "primary", label: "Avg. Rating", value: dashboardData?.departmentStats?.averageRating || 0
        }].map((stat, index) => (
          <div className="card bg-base-100 shadow-md" key={index}>
            <div className="card-body flex flex-row items-center">
              <div className={`p-4 rounded-full bg-${stat.color}-100`}>
                <Icon icon={stat.icon} className={`w-6 h-6 text-${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Pending Appraisals</h2>
              <Link to="/supervisor/appraisals" className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white
               bg-blue-600 rounded-xl shadow-lg transition-all duration-200 hover:bg-red-600 hover:shadow-2xl active:scale-95">View All</Link>
            </div>
            <Table removeWrapper aria-label="Pending appraisals">
              <TableHeader>
                <TableColumn>EMPLOYEE</TableColumn>
                <TableColumn>POSITION</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {dashboardData?.pendingAppraisals?.length > 0 ? (
                  dashboardData.pendingAppraisals.map((appraisal: any) => (
                    <TableRow key={appraisal.id}>
                      <TableCell>{appraisal.employee_name}</TableCell>
                      <TableCell>{appraisal.position}</TableCell>
                      <TableCell>
                        <Chip size="sm" color={getStatusColor(appraisal.status)} variant="flat">
                          {appraisal.status}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <Link to={`/appraisal/${appraisal.id}`} className="btn btn-sm btn-outline btn-primary">Review</Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center">
                        <Lottie animationData={androidBotAnimation} style={{ width: 180 }} loop />
                        <p className="mt-2 text-sm text-gray-500">No pending appraisals found.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Team Members</h2>
                  <Link
                  to="/supervisor/team"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl shadow-lg transition-all duration-200 hover:bg-red-600 hover:shadow-2xl active:scale-95"
                >
                  View Team
                </Link>
            </div>
            <div className="space-y-4">
              {dashboardData?.teamMembers?.length > 0 ? (
                dashboardData.teamMembers.map((member: any) => (
                  <div key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar src={member.avatar} name={member.name} size="sm" />
                      <div className="ml-3">
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.position}</p>
                      </div>
                    </div>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly size="sm" variant="light">
                          <Icon icon="lucide:more-vertical" className="w-4 h-4" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Actions">
                        <DropdownItem key="start-appraisal">
                          <Link to={`/appraisal/new?employee=${member.id}`}>Start Appraisal</Link>
                        </DropdownItem>
                        <DropdownItem key="view-profile">
                          <Link to={`/supervisor/team/${member.id}`}>View Profile</Link>
                        </DropdownItem>
                        <DropdownItem key="set-goals">
                          <Link to={`/supervisor/goals/${member.id}`}>Set Goals</Link>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <Lottie animationData={androidBotAnimation} style={{ width: 180 }} loop />
                  <p className="mt-2 text-sm text-gray-500">No team members found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="text-lg font-semibold mb-4">Department Performance</h2>
          <div className="space-y-6">
            {[{
              label: "Communication", score: 4.2, value: 84
            }, {
              label: "Technical Skills", score: 4.5, value: 90
            }, {
              label: "Teamwork", score: 4.0, value: 80
            }, {
              label: "Problem Solving", score: 3.8, value: 76
            }, {
              label: "Initiative", score: 3.9, value: 78
            }].map((metric, index) => (
              <div key={index}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{metric.label}</span>
                  <span>{metric.score}/5</span>
                </div>
                <progress className="progress progress-primary w-full" value={metric.value} max="100"></progress>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SupervisorDashboard;
