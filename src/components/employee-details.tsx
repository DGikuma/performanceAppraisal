import React from "react";
import { Input } from "@heroui/react";
import ThemeToggle from "../components/themeToggle";

interface EmployeeDetailsProps {
  data: {
    name: string;
    employeeId: string;
    department: string;
    position: string;
    manager: string;
    reviewPeriod: string;
  };
  updateData: (data: Partial<EmployeeDetailsProps["data"]>) => void;
}

export const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ data, updateData }) => {
  const departments = [
    { key: "none", label: "None" },
    { key: "management", label: "Management" },
    { key: "claims", label: "Claims" },
    { key: "underwriting", label: "Underwriting" },
    { key: "ict", label: "ICT" },
    { key: "finance_admin", label: "Finance & Administration" },
    { key: "operations", label: "Operations" },
    { key: "hr", label: "HR" },
    { key: "marketing", label: "Marketing" },
    { key: "business_development", label: "Business Development" },
    { key: "legal", label: "Legal" },
    { key: "sales", label: "Sales" },
    { key: "customer_service", label: "Customer Service" },
    { key: "procurement", label: "Procurement" },
    { key: "product_management", label: "Product Management" },
    { key: "project_management", label: "Project Management" },
    { key: "data_analysis", label: "Data Analysis" },
  ];

  const generateReviewPeriods = (year: number) => [
    { key: `q1_${year}`, label: `Q1 ${year} (Jan-Mar)`, value: `Q1 ${year}` },
    { key: `q2_${year}`, label: `Q2 ${year} (Apr-Jun)`, value: `Q2 ${year}` },
    { key: `q3_${year}`, label: `Q3 ${year} (Jul-Sep)`, value: `Q3 ${year}` },
    { key: `q4_${year}`, label: `Q4 ${year} (Oct-Dec)`, value: `Q4 ${year}` },
    { key: `h1_${year}`, label: `H1 ${year} (Jan-Jun)`, value: `H1 ${year}` },
    { key: `h2_${year}`, label: `H2 ${year} (Jul-Dec)`, value: `H2 ${year}` },
    { key: `annual_${year}`, label: `Annual ${year}`, value: `Annual ${year}` },
  ];

  const currentYear = new Date().getFullYear();

  const reviewPeriods = [
    ...generateReviewPeriods(currentYear + 1),
    ...generateReviewPeriods(currentYear),
    ...generateReviewPeriods(currentYear - 1),
  ];

  const handleChange = (field: string, value: string) => {
    updateData({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <ThemeToggle />
      </div>
      <h2 className="text-xl font-semibold mb-4">Employee Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          placeholder="Enter full name"
          value={data.name}
          onValueChange={(value) => handleChange("name", value)}
          isRequired
          className="w-full "
          autoFocus
        />

        <Input
          placeholder="Enter employee ID"
          value={data.employeeId}
          onValueChange={(value) => handleChange("employeeId", value)}
          isRequired
        />

        <div>
          <label htmlFor="department-select" className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <select
            id="department-select"
            value={data.department}
            onChange={(e) => handleChange("department", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          >
            <option value="" disabled>
              Select department
            </option>
            {departments.map((dept) => (
              <option key={dept.key} value={dept.key}>
                {dept.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          placeholder="Enter position or title"
          value={data.position}
          onValueChange={(value) => handleChange("position", value)}
          isRequired
        />

        <Input
          placeholder="Enter manager's name"
          value={data.manager}
          onValueChange={(value) => handleChange("manager", value)}
          isRequired
        />

        <div>
          <label htmlFor="review-period-select" className="block text-sm font-medium text-gray-700 mb-1">
            Review Period
          </label>
          <select
            id="review-period-select"
            value={data.reviewPeriod}
            onChange={(e) => handleChange("reviewPeriod", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          >
            <option value="" disabled>
              Select review period
            </option>
            {reviewPeriods.map((period) => (
              <option key={period.key} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
