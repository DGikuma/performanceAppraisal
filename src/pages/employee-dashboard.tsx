import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/dashboard-layout";
import { useAuth } from "../contexts/auth-context";
import DashboardLoader from "../components/DashboardLoader";
import ThemeToggle from "../components/themeToggle";

import Lottie from "lottie-react";
import androidBotAnimation from "../assets/androidBot.json";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const EmployeeDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/settings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.maintenanceMode) {
          navigate("/maintenance");
        }
      } catch (err) {
        console.error("Failed to check maintenance mode:", err);
      } finally {
        setLoading(false);
      }
    };

    checkMaintenance();
  }, [navigate]);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
      const fetchDashboardData = async () => {
        try {
          const res = await fetch("/api/dashboard/employee", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          if (res.ok) {
            setDashboardData(data);
          }
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

    useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/auth/recent-appraisals?user_id=${user?.id}`);
        const data = await res.json();
        setDashboardData(data);
      } catch (error) {
        console.error("❌ Failed to load dashboard data:", error);
      }
    };

    if (user?.id) fetchDashboardData();
  }, [user?.id]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "completed": return "badge-success";
      case "in-progress": return "badge-primary";
      case "pending": return "badge-warning";
      default: return "badge-ghost";
    }
  };

    useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [goalsRes, appraisalsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/auth/goals?user_id=${user?.id}`),
          fetch(`http://localhost:5000/api/auth/recent-appraisals?user_id=${user?.id}`),
        ]);

        const goalsData = await goalsRes.json();
        const appraisalsData = await appraisalsRes.json();

        setDashboardData({
          goals: goalsData.goals,
          recentAppraisals: appraisalsData.recentAppraisals,
        });
      } catch (error) {
        console.error("❌ Failed to fetch dashboard data:", error);
      }
    };

    if (user?.id) fetchDashboardData();
  }, [user?.id]);

  const calculateDaysLeft = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diff = due.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };
  
  const goalsCompletion = dashboardData?.goals ?
    Math.round(dashboardData.goals.reduce((acc: number, goal: any) => acc + goal.progress, 0) / dashboardData.goals.length) : 0;

  if (loading) {
    return <DashboardLoader />;
  }

  return (
    <DashboardLayout title="Employee Dashboard">
        <div className="flex justify-between items-center mb-4">
        <ThemeToggle />
        </div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 hidden md:block">Welcome, {user?.name}</h1>
        <p className="text-gray-600 mt-1 hidden md:block">
          Here's an overview of your performance appraisals and goals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card bg-base-100 shadow">
          <div className="card-body flex-row items-center">
            <div className="p-2 rounded-full bg-primary/20">
              <Icon icon="lucide:clipboard-check" className="w-6 h-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Last Appraisal Rating</p>
              <p className="text-2xl font-semibold">{dashboardData?.recentAppraisals?.[0]?.performance_rating || 'N/A'}/5.0</p>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body flex-row items-center">
            <div className="p-2 rounded-full bg-success/20">
              <Icon icon="lucide:target" className="w-6 h-6 text-success" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Goals Completion</p>
              <p className="text-2xl font-semibold">{goalsCompletion}%</p>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body flex-row items-center">
            <div className="p-2 rounded-full bg-warning/20">
              <Icon icon="lucide:calendar" className="w-6 h-6 text-warning" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Next Appraisal</p>
              <p className="text-2xl font-semibold">{dashboardData?.upcomingAppraisal ? `${calculateDaysLeft(dashboardData.upcomingAppraisal.due_date)} days` : 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Appraisals */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Appraisals</h2>
              <Link to="/employee/appraisals" className="btn btn-sm btn-primary btn-outline">
                View All <Icon icon="lucide:arrow-right" className="ml-1 w-4 h-4" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Period</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData?.recentAppraisals?.length > 0 ? (
                    dashboardData.recentAppraisals.map((appraisal: any) => (
                      <tr key={appraisal.id}>
                        <td>{appraisal.period}</td>
                        <td>
                          <div className="flex items-center">
                            <span className="font-medium">{appraisal.performance_rating}</span>
                            <div className="ml-2 text-warning">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Icon
                                  key={star}
                                  icon={star <= Math.floor(appraisal.performance_rating) ? "lucide:star" : "lucide:star-off"}
                                  className="w-3 h-3"
                                />
                              ))}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`badge badge-sm ${getStatusClass(appraisal.status)}`}>
                            {appraisal.status}
                          </span>
                        </td>
                        <td>{new Date(appraisal.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center">
                          <Lottie
                            animationData={androidBotAnimation}
                            style={{ width: 200, height: 200 }}
                            loop
                          />
                          <p className="mt-2 text-sm text-gray-500">No recent appraisals found.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Goals */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Current Goals</h2>
              <Link to="/employee/goals" className="btn btn-sm btn-primary btn-outline">
                Manage Goals <Icon icon="lucide:arrow-right" className="ml-1 w-4 h-4" />
              </Link>
            </div>
          <div className="space-y-6">
            {dashboardData?.goals?.length > 0 ? (
              dashboardData.goals.map((goal: any) => (
                <div key={goal.id}>
                  <div className="flex justify-between">
                    <p className="font-medium">{goal.description}</p>
                    <span className="text-sm text-gray-500">Due: {new Date(goal.due_date).toLocaleDateString()}</span>
                  </div>
                  <progress
                    className="progress progress-primary w-full"
                    value={goal.progress}
                    max={100}
                  ></progress>
                  <span className="text-sm font-medium">{goal.progress}%</span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <Lottie
                  animationData={androidBotAnimation}
                  style={{ width: 200, height: 200 }}
                  loop
                />
                <p className="mt-2 text-sm text-gray-500">No goals assigned yet.</p>
              </div>
            )}
          </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appraisal */}
      {dashboardData?.upcomingAppraisal && (
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Upcoming Appraisal</h2>
              <Link to={`/appraisal/${dashboardData.upcomingAppraisal.id}`} className="btn btn-primary">
                <Icon icon="lucide:file-plus" className="mr-2 w-4 h-4" />
                Start Self-Assessment
              </Link>
            </div>

            <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
              <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {dashboardData.upcomingAppraisal.period} Performance Review
                  </h3>
                  <p className="text-gray-600 mt-1">Due by {new Date(dashboardData.upcomingAppraisal.due_date).toLocaleDateString()}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className="badge badge-warning badge-outline">
                    {calculateDaysLeft(dashboardData.upcomingAppraisal.due_date)} days remaining
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Complete your self-assessment before the deadline to ensure your manager has time to review your performance.
              </p>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
