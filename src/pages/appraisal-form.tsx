import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppraisalForm as AppraisalFormComponent } from "../components/appraisal-form";
import DashboardLayout from "../components/dashboard-layout";
import { useAuth } from "../contexts/auth-context";

const AppraisalForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call or load logic here
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [id]);

  const getTitle = () => {
    if (id === "new") return "New Performance Appraisal";
    if (id) return "Edit Performance Appraisal";
    return "Performance Appraisal";
  };

  return (
    <DashboardLayout title={getTitle()}>
      {isLoading ? (
        <div className="text-center mt-10">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        <AppraisalFormComponent />
      )}
    </DashboardLayout>
  );
};

export default AppraisalForm;
