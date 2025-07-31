import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth-context";
import DashboardLayout from "../../components/dashboard-layout";
import Lottie from "lottie-react";
import androidBotAnimation from "../../assets/androidBot.json";

type Appraisal = {
  employee_name: string;
  reviewer_name: string;
  employee_id: string;
  period: string;  
  performance_rating?: string | number;
  status: string;
  created_at: string;

  // Add any other fields as needed
};

const AppraisalsPage: React.FC = () => {
  const { user } = useAuth();
  const [appraisals, setAppraisals] = useState<Appraisal[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`http://localhost:5000/api/auth/recent-appraisals?user_id=${user?.id}`);
      const data = await res.json();
      setAppraisals(data.recentAppraisals);
    };

    if (user?.id) fetchData();
  }, [user]);

  return (
    <DashboardLayout title="Performance Appraisals">
    <div className="overflow-x-auto mt-6">
    <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-xl bg-whiten">
        <thead className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
        <tr>
            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Period</th>
            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Rating</th>
            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Date</th>
        </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
        {appraisals.length > 0 ? (
            appraisals.map((a, idx) => {
            const statusClass =
                a.status === "completed"
                ? "bg-green-100 text-green-800"
                : a.status === "supervisor_review"
                ? "bg-yellow-100 text-yellow-800"
                : a.status === "self_assessment"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800";

                function handleEdit(a: Appraisal): void {
                    // Example: Navigate to appraisal detail or edit page
                    // You may use react-router's useNavigate if available
                    // For now, just alert or log the appraisal
                    alert(`Viewing appraisal for ${a.employee_name} reviewed by ${a.reviewer_name}`);
                }
            return (
                <tr
                key={idx}
                onClick={() => handleEdit(a)}
                className="hover:bg-gray-50 dark:hover:bg-lime-200 cursor-pointer transition-colors duration-150"
                >
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-600">
                    {a.period}
                </td>
                <td className="px-6 py-4 text-sm text-blue-600 dark:text-gray-600">
                    {a.performance_rating}
                </td>
                <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusClass}`}>
                    {a.status.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(a.created_at).toLocaleDateString()}
                </td>
                </tr>
            );
            })
        ) : (
            <tr>
            <td colSpan={5} className="text-center py-10">
                <div className="flex flex-col items-center justify-center">
                <Lottie animationData={androidBotAnimation} style={{ width: 200, height: 200 }} loop />
                <p className="mt-2 text-sm text-gray-500">No appraisal records found.</p>
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

export default AppraisalsPage;
