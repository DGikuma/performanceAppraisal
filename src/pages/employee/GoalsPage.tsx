import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth-context";
import Lottie from "lottie-react";
import androidBotAnimation from "../../assets/androidBot.json";
import DashboardLayout from "../../components/dashboard-layout";

const GoalsPage: React.FC = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/auth/goals?user_id=${user?.id}`);
        const data = await res.json();
        setGoals(data.goals);
      } catch (err) {
        console.error("❌ Failed to fetch goals:", err);
      }
    };

    if (user?.id) fetchGoals();
  }, [user]);

  return (
<DashboardLayout title="Manage Goals">
  <div className="overflow-x-auto mt-6">
    <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-xl bg-white">
      <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Goal</th>
          <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Due Date</th>
          <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Progress</th>
          <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {goals.length > 0 ? (
          goals.map((goal: any) => {
            const progress = goal.progress ?? 0;
            const statusColor =
              progress === 100
                ? "bg-green-100 text-green-800"
                : progress >= 50
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800";

            return (
              <tr
                key={goal.id}
                className="hover:bg-gray-50 transition-colors duration-150 dark:hover:bg-lime-200"
              >
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-600">
                  {goal.description}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(goal.due_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-900">
                      <div
                        className={`h-2.5 rounded-full ${
                          progress >= 100
                            ? "bg-green-500"
                            : progress >= 50
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        } goal-progress-bar`}
                        data-progress={progress}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-900 w-12 text-right">
                      {progress}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColor}`}
                  >
                    {progress === 100
                      ? "Completed"
                      : progress >= 50
                      ? "On Track"
                      : "Behind"}
                  </span>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={4} className="text-center py-10">
              <div className="flex flex-col items-center justify-center">
                <Lottie
                  animationData={androidBotAnimation}
                  style={{ width: 200, height: 200 }}
                  loop
                />
                <p className="mt-2 text-sm text-gray-500">No goals assigned yet.</p>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</DashboardLayout>

  );
};

export default GoalsPage;
