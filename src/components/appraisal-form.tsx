import * as React from "react";
import { 
  Card, 
  Button, 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  useDisclosure
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { EmployeeDetails } from "./employee-details";
import { PerformanceEvaluation } from "./performance-evaluation";
import { GoalSetting } from "./goal-setting";
import { useAuth } from "../contexts/auth-context";

export const AppraisalForm: React.FC = () => {
  const { user } = useAuth(); 
  const [currentStep, setCurrentStep] = React.useState(0);
  const [formData, setFormData] = React.useState({
    employeeDetails: {
      name: "",
      employeeId: "",
      department: "",
      position: "",
      manager: "",
      reviewPeriod: "",
    },
    performanceEvaluation: {
      jobKnowledge: 0,
      workQuality: 0,
      productivity: 0,
      communication: 0,
      teamwork: 0,
      problemSolving: 0,
      initiative: 0,
      adaptability: 0,
      strengths: "",
      areasForImprovement: "",
      overallRating: 0,
      comments: "",
    },
    goalSetting: {
      goals: [
        { id: "1", description: "", targetDate: "", measures: "" }
      ],
      developmentPlan: "",
      employeeComments: "",
      managerComments: "",
    }
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [showErrorSnackbar, setShowErrorSnackbar] = React.useState(false);

  React.useEffect(() => {
    if (showErrorSnackbar) {
      const timeout = setTimeout(() => {
        setShowErrorSnackbar(false);
      }, 4000); // Hide after 4 seconds
      return () => clearTimeout(timeout);
    }
  }, [showErrorSnackbar]);

  const steps = [
    {
      title: "Employee Details",
      description: "Basic information",
      icon: "lucide:user",
    },
    {
      title: "Performance Evaluation",
      description: "Rate performance criteria",
      icon: "lucide:bar-chart-2",
    },
    {
      title: "Goal Setting",
      description: "Set future goals",
      icon: "lucide:target",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

    const handleSubmit = async () => {
      setIsSubmitting(true);

      try {
        const flattenedData: {
          name: string;
          employeeId: string;
          department: string;
          position: string;
          manager: string;
          reviewPeriod: string;
          jobKnowledge: number;
          workQuality: number;
          productivity: number;
          communication: number;
          teamwork: number;
          problemSolving: number;
          initiative: number;
          adaptability: number;
          strengths: string;
          areasForImprovement: string;
          overallRating: number;
          comments: string;
          goals: { id: string; description: string; targetDate: string; measures: string }[];
          developmentPlan: string;
          employeeComments: string;
          managerComments: string;
        } = {
          ...formData.employeeDetails,
          ...formData.performanceEvaluation,
          ...formData.goalSetting,
        };

          const payload = {
            employee_id: user?.id ?? 0,
            supervisor_id: user?.id ?? 0, 
            period_name: flattenedData.reviewPeriod, 

            job_knowledge: flattenedData.jobKnowledge,
            work_quality: flattenedData.workQuality,
            productivity: flattenedData.productivity,
            communication: flattenedData.communication,
            teamwork: flattenedData.teamwork,
            problem_solving: flattenedData.problemSolving,
            initiative: flattenedData.initiative,
            adaptability: flattenedData.adaptability,

            strengths: flattenedData.strengths,
            areas_for_improvement: flattenedData.areasForImprovement,
            overall_rating: flattenedData.overallRating,
            comments: flattenedData.comments,

            goals: flattenedData.goals,
            development_plan: flattenedData.developmentPlan,
            employee_comments: flattenedData.employeeComments,
            manager_comments: flattenedData.managerComments,
            status: "supervisor_review", // ✅ for example
          };


        console.log("📤 Submitting Mapped Appraisal Payload:", payload);

        const response = await fetch("http://localhost:5000/api/auth/appraisal", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to submit appraisal");
    }

    const result = await response.json();
    console.log("✅ Simulated API Response:", result);

    onOpen(); // confirmation modal
  } catch (error) {
    console.error("❌ Submission error:", error);
    setShowErrorSnackbar(true);
  } finally {
    setIsSubmitting(false);
  }
};

  type SectionKey = "employeeDetails" | "performanceEvaluation" | "goalSetting";
  
    const updateFormData = (section: SectionKey, data: any) => {
      setFormData((prevData) => ({
        ...prevData,
        [section]: {
          ...prevData[section],
          ...data,
        },
      }));
    }

    const resetForm = () => {
    setCurrentStep(0);
    setFormData({
      employeeDetails: {
        name: "",
        employeeId: "",
        department: "",
        position: "",
        manager: "",
        reviewPeriod: "",
      },
      performanceEvaluation: {
        jobKnowledge: 0,
        workQuality: 0,
        productivity: 0,
        communication: 0,
        teamwork: 0,
        problemSolving: 0,
        initiative: 0,
        adaptability: 0,
        strengths: "",
        areasForImprovement: "",
        overallRating: 0,
        comments: "",
      },
      goalSetting: {
        goals: [
          { id: "1", description: "", targetDate: "", measures: "" }
        ],
        developmentPlan: "",
        employeeComments: "",
        managerComments: "",
      }
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <EmployeeDetails 
            data={formData.employeeDetails} 
            updateData={(data) => updateFormData("employeeDetails", data)} 
          />
        );
      case 1:
        return (
          <PerformanceEvaluation 
            data={formData.performanceEvaluation} 
            updateData={(data) => updateFormData("performanceEvaluation", data)} 
          />
        );
      case 2:
        return (
          <GoalSetting 
            data={formData.goalSetting} 
            updateData={(data) => updateFormData("goalSetting", data)} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between relative">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`flex items-center mb-4 md:mb-0 ${index < steps.length - 1 ? "flex-1" : ""}`}
              >
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index === currentStep 
                        ? "bg-primary text-white" 
                        : index < currentStep 
                          ? "bg-primary-100 text-primary-600" 
                          : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <Icon icon={step.icon} className="w-5 h-5" />
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`font-medium ${index === currentStep ? "text-primary" : "text-gray-700"}`}>
                      {step.title}
                    </p>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="hidden md:block flex-1 h-0.5 mx-4 bg-gray-200 relative">
                    {index < currentStep && (
                      <div className="absolute inset-0 bg-primary" />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="py-4">
          {renderStepContent()}
        </div>

        <div className="flex justify-between mt-8 gap-4">
          {/* Previous Button */}
          <Button
            onPress={handlePrevious}
            isDisabled={currentStep === 0}
            startContent={<Icon icon="lucide:arrow-left" className="w-4 h-4" />}
            className={`
              transition-all duration-300 transform hover:scale-105 
              ${currentStep === 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-600 text-white hover:bg-gray-700"}
              rounded-xl shadow-md px-6 py-2 font-medium
            `}
          >
            Previous
          </Button>

          {/* Conditional Next or Submit */}
          {currentStep < steps.length - 1 ? (
            <Button
              onPress={handleNext}
              endContent={<Icon icon="lucide:arrow-right" className="w-4 h-4" />}
              className={`
                transition-all duration-300 transform hover:scale-105
                ${
                  currentStep === 0
                    ? "bg-red-400 hover:bg-red-500"
                    : currentStep === 1
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-red-600 hover:bg-red-700"
                }
                text-white rounded-xl shadow-lg px-6 py-2 font-medium
              `}
            >
              Next
            </Button>
          ) : (
            <Button
              onPress={handleSubmit}
              isLoading={isSubmitting}
              endContent={!isSubmitting && <Icon icon="lucide:check" className="w-4 h-4" />}
              className={`
                transition-all duration-300 transform hover:scale-105 
                bg-blue-600 hover:bg-green-600 
                text-white rounded-xl shadow-xl px-6 py-2 font-semibold
              `}
            >
              Submit Appraisal
            </Button>
          )}
        </div>

      </Card>

        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          className="backdrop-blur-md bg-white/70 rounded-2xl shadow-2xl"
          backdrop="blur"
        >
         <ModalContent>
          {(onClose) => {
            const handleModalClose = () => {
              onClose();     
              resetForm();  
            };

            return (
              <>
                <ModalHeader className="flex flex-col gap-1 text-center text-2xl font-semibold text-green-700">
                  Appraisal Successfully Submitted
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col items-center justify-center text-center space-y-3">
                    <div className="bg-green-100 p-4 rounded-full shadow-lg animate-pulse">
                      <Icon
                        icon="lucide:check-circle"
                        className="w-12 h-12 text-green-600 drop-shadow-lg"
                      />
                    </div>
                    <p className="text-lg font-medium text-gray-800">
                      The performance appraisal for{" "}
                      <strong className="text-green-700">{formData.employeeDetails.name}</strong>{" "}
                      has been successfully submitted.
                    </p>
                    <p className="text-sm text-gray-500">
                      A notification has been sent to the relevant stakeholders.
                    </p>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    onPress={handleModalClose}
                    className="rounded-xl bg-green-600 hover:bg-green-700 text-white px-6 py-2 shadow-md transition-all duration-200"
                  >
                    Close
                  </Button>
                </ModalFooter>
              </>
            );
          }}
        </ModalContent>
        </Modal>
        {showErrorSnackbar && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in bg-gradient-to-r from-red-600 via-pink-500 to-yellow-400 text-white px-6 py-4 rounded-2xl shadow-2xl ring-2 ring-white/20 transform transition-all duration-500 hover:scale-105 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <Icon icon="lucide:alert-triangle" className="w-6 h-6 animate-bounce" />
            <div className="text-sm font-medium drop-shadow-sm">
              Error submitting the appraisal. Please check your connection or try again.
            </div>
          </div>
        </div>
      )}

    </div>
  );
};