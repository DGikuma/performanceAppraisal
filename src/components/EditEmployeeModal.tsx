import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button
} from "@heroui/react";

type Props = {
  open: boolean;
  onClose: () => void;
  employee: any;
  onSave: (emp: any) => void;
};

const EditEmployeeModal: React.FC<Props> = ({ open, onClose, employee, onSave }) => {
  const [form, setForm] = React.useState(employee || {});

  React.useEffect(() => {
    setForm(employee || {});
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

  const handleSubmit = () => {
    onSave(form);
  };

  return (
  <Modal isOpen={open} onOpenChange={onClose} backdrop="blur">
    <ModalContent className="rounded-2xl bg-gradient-to-br from-white via-blue-50 to-purple-100 shadow-2xl border border-blue-100 max-w-lg w-full mx-auto p-4">
      <ModalHeader className="text-center text-xl font-bold text-blue-700 pb-2">Edit Employee</ModalHeader>

      <ModalBody className="space-y-3 pb-1">
        <Input
          name="name"
          value={form.name || ""}
          onChange={handleChange}
          radius="lg"
          className="shadow-md"
        />
        <Input
          name="email"
          value={form.email || ""}
          onChange={handleChange}
          radius="lg"
          className="shadow-md"
        />
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Department</label>
          <select
            name="department"
            value={form.department || ""}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {departments.map((dept) => (
              <option key={dept.key} value={dept.key}>
                {dept.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Role</label>
          <select
            name="role"
            value={form.role || ""}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Role --</option>
            <option value="employee">Employee</option>
            <option value="supervisor">Supervisor</option>
          </select>
        </div>

        {/* Buttons side by side */}
        <div className="flex justify-center gap-3 pt-2">
          <Button
            variant="flat"
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-white bg-gradient-to-br from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 transition-transform transform hover:-translate-y-[2px] shadow-lg hover:shadow-xl"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-lg text-white bg-gradient-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 transition-transform transform hover:-translate-y-[2px] shadow-lg hover:shadow-xl"
          >
            Save
          </Button>
        </div>
      </ModalBody>
    </ModalContent>
  </Modal>

  );
};

export default EditEmployeeModal;
