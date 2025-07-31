import { useEffect, useState } from "react";
import {
  Card, CardBody, CardHeader, Button, Input, Table, TableBody, TableCell,
  TableColumn, TableHeader, TableRow
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import EditEmployeeModal from "../../components/EditEmployeeModal";
import DashboardLayout from "../../components/dashboard-layout";
import { useAuth } from "../../contexts/auth-context";
import { exportToCSV, exportToPDF } from '../../../backend/src/utils/exportUtils';
import { DownloadIcon } from "lucide-react";
import ThemeToggle from "../../components/themeToggle";
import Lottie from "lottie-react";
import androidBotAnimation from "../../assets/androidBot.json";
import toast from "react-hot-toast";
import {
  PencilIcon,
  EyeIcon,
  TrashIcon
} from "@heroicons/react/24/solid";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/solid";
import DeleteAlertDialog from "../admin/DeleteAlertDialog"; 
import ViewEmployeeCard from "../admin/ViewEmployeeCard"; 

type Employee = {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  supervisor_name?: string; 
};

const EmployeesPage = () => {
  const { token } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filtered, setFiltered] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [employeeToAssign, setEmployeeToAssign] = useState<Employee | null>(null);
  const [selectedSupervisor, setSelectedSupervisor] = useState<string>("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [employeeToView, setEmployeeToView] = useState<Employee | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    setFiltered(
      employees.filter(emp =>
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, employees]);

  const fetchEmployees = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      console.log("Employees fetched:", data);

      setEmployees(data);
      setAllEmployees(data);
    } catch (err) {
      console.error("❌ Error fetching employees:", err);
    }
  };

  const handleAssignSupervisor = async (employeeToAssign: Employee, selectedSupervisorId: string) => {
    try {
      toast.loading("Assigning supervisor...", { id: "assign-toast" });

      const res = await fetch(`http://localhost:5000/api/employees/${employeeToAssign.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: employeeToAssign.name,
          email: employeeToAssign.email,
          department: employeeToAssign.department,
          role: employeeToAssign.role,
          supervisor_id: selectedSupervisorId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to assign supervisor", { id: "assign-toast" });
        throw new Error(data.message || "Failed to assign supervisor");
      }

      toast.success("Supervisor assigned successfully", { id: "assign-toast" });
      fetchEmployees();
      setAssignModalOpen(false);
    } catch (err: any) {
      toast.error(`Error: ${err.message}`, { id: "assign-toast" });
      console.error("❌ Error assigning supervisor:", err.message);
    }
  };

  const handleEdit = async (emp: Employee) => {
    try {
      const res = await fetch(`http://localhost:5000/api/employees/${emp.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Error fetching employee");
        return;
      }

      console.log("Selected Employee →", data);
      setSelectedEmployee(data);
      setModalOpen(true);
    } catch (err: any) {
      toast.error("Failed to fetch employee details");
      console.error(err);
    }
  };

  const handleUpdate = async (updated: any) => {
    try {
      const res = await fetch(`http://localhost:5000/api/employees/${updated.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updated)
      });

      const data = await res.json();

      if (res.ok) {
        setEmployees(prev =>
          prev.map(emp =>
            emp.id === updated.id ? { ...updated, supervisor_name: emp.supervisor_name } : emp
          )
        );
        setModalOpen(false);
      } else {
        toast.error(data.message || "Failed to update employee");
      }
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Name", "Email", "Department", "Role"]],
      body: filtered.map(emp => [emp.name, emp.email, emp.department, emp.role]),
    });
    doc.save("employees.pdf");
  };

  return (
    <DashboardLayout title="Employees">
            <div className="flex justify-between items-center mb-4">
        <ThemeToggle />
        </div>
      <Card className="shadow-xl rounded-xl">
        <CardHeader className="flex justify-between items-center border-b">
          <h2 className="text-xl font-semibold">All Employees</h2>
          <div className="flex gap-3">
            <Input
              placeholder="Search name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="sm"
              className="w-56"
            />
            <Button
              onClick={() => exportToCSV(filtered, 'employees')}
              size="sm"
              color="primary"
              variant="flat"
              className="relative px-4 py-2 font-semibold text-white bg-gradient-to-r from-green-500 to-green-700 rounded-lg shadow-xl hover:from-green-600 hover:to-green-800 transform hover:-translate-y-[2px] hover:shadow-[0_10px_20px_rgba(0,255,100,0.4)] transition-all duration-300 ease-in-out"
            >
              CSV <DownloadIcon className="ml-1" size={16} />
            </Button>

            <Button
              onClick={() =>
                exportToPDF(filtered, 'Employees Report', ['name', 'email', 'department'])
              }
              size="sm"
              color="primary"
              variant="flat"
              className="relative px-4 py-2 font-semibold text-white bg-gradient-to-r from-red-500 to-red-700 rounded-lg shadow-xl hover:from-red-600 hover:to-red-800 transform hover:-translate-y-[2px] hover:shadow-[0_10px_20px_rgba(255,50,50,0.4)] transition-all duration-300 ease-in-out ml-3"
            >
              PDF <DownloadIcon className="ml-1" size={16} />
            </Button>

          </div>
        </CardHeader>
        <CardBody className="overflow-x-auto p-0">
        <Table
          isStriped
          className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 backdrop-blur-sm bg-white/80"
        >
          <TableHeader className="bg-gradient-to-r from-indigo-100 to-purple-100 text-gray-700 text-sm uppercase tracking-wider">
            <TableColumn className="px-4 py-3">NAME</TableColumn>
            <TableColumn className="px-4 py-3">EMAIL</TableColumn>
            <TableColumn className="px-4 py-3">DEPARTMENT</TableColumn>
            <TableColumn className="px-4 py-3">ROLE</TableColumn>
            <TableColumn className="px-4 py-3">SUPERVISOR NAME</TableColumn>
            <TableColumn className="px-4 py-3">ACTION</TableColumn>
            <TableColumn className="px-4 py-3">SUPERVISOR</TableColumn>
          </TableHeader>

          <TableBody>
            {filtered.length > 0 ? (

              filtered.map((emp: any) => (
                <TableRow
                  key={emp.id}

                  className="hover:bg-indigo-50 transition-all duration-300"
                >
                  <TableCell className="px-4 py-3 font-medium text-gray-800">{emp.name}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-700">{emp.email}</TableCell>
                  <TableCell className="px-4 py-3">{emp.department}</TableCell>
                  <TableCell className="px-4 py-3">{emp.role}</TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-600">
                    {emp.supervisor_name || "None"}
                  </TableCell>
                  <TableCell className="relative px-4 py-3">
                    <div className="relative inline-block text-left">
                    <button
                      onClick={() =>
                        setSelectedEmployee((prev) => (prev?.id === emp.id ? null : emp))
                      }
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl shadow-md bg-gradient-to-tr from-green-50 via-green-100 to-white text-green-700 font-semibold hover:bg-gradient-to-tr hover:from-green-100 hover:to-green-200 hover:text-green-800 hover:shadow-2xl transform hover:-translate-y-[1px] transition-all duration-300 ease-out"
                    >
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-green-200 shadow-inner shadow-green-300">
                        <ClipboardDocumentCheckIcon className="w-5 h-5 text-green-700" />
                      </span>
                      Actions
                    </button>
                      {selectedEmployee?.id === emp.id && (
                        <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl bg-white/80 backdrop-blur-md shadow-2xl ring-1 ring-blue-200 animate-dropdown-fade-in">
                          <div className="py-2 space-y-1">
                            {/* Edit */}
                            <button
                              onClick={() => handleEdit(emp)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-800 hover:bg-blue-50 rounded-xl transition"
                            >
                              <div className="bg-indigo-100 p-1.5 rounded-full shadow-inner mr-3">
                                <PencilIcon className="w-5 h-5 text-indigo-600" />
                              </div>
                              Edit Employee
                            </button>

                            {/* View */}
                            <button
                            onClick={() => {
                              setEmployeeToView(emp);
                              setShowViewModal(true);
                            }}                            
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-800 hover:bg-green-50 rounded-xl transition"
                            >
                              <div className="bg-green-100 p-1.5 rounded-full shadow-inner mr-3">
                                <EyeIcon className="w-5 h-5 text-green-600" />
                              </div>
                              View Details
                            </button>

                            {/* Delete */}
                            <button
                            onClick={() => {
                              setEmployeeToDelete(emp);
                              setShowDeleteModal(true);
                            }}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition"
                            >
                              <div className="bg-red-100 p-1.5 rounded-full shadow-inner mr-3">
                                <TrashIcon className="w-5 h-5 text-red-600" />
                              </div>
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Button
                      onClick={() => {
                        setEmployeeToAssign(emp);
                        setAssignModalOpen(true);
                      }}
                      size="sm"
                      variant="flat"
                      className="text-green-600 bg-green-50 hover:bg-green-100 font-semibold px-3 py-1.5 rounded-lg shadow-sm transition duration-200"
                    >
                      <Icon icon="lucide:user-plus" className="w-4 h-4 mr-1" />
                      Assign
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <Lottie
                      animationData={androidBotAnimation}
                      style={{ width: 200, height: 200 }}
                      loop
                    />
                    <p className="mt-2 text-md">No employees found.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </CardBody>
      </Card>

      {showDeleteModal && employeeToDelete && (
      <DeleteAlertDialog
        open={showDeleteModal}
        name={employeeToDelete.name}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          toast.loading("Deleting...", { id: "delete-toast" });
          try {
            const res = await fetch(`http://localhost:5000/api/employees/${employeeToDelete.id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
              toast.success("Employee deleted", { id: "delete-toast" });
              setEmployees(prev => prev.filter(emp => emp.id !== employeeToDelete.id));
            } else {
              const data = await res.json();
              toast.error(data.message || "Delete failed", { id: "delete-toast" });
            }
          } catch (err) {
            toast.error("An error occurred", { id: "delete-toast" });
          }
          setShowDeleteModal(false);
        }}
      />
    )}

    {showViewModal && employeeToView && (
      <ViewEmployeeCard
        open={showViewModal}
        onClose={() => setShowViewModal(false)}
        employee={employeeToView}
      />
    )}

      {/* Edit Modal */}
      <EditEmployeeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        employee={selectedEmployee}
        onSave={handleUpdate}
      />

      {assignModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Assign Supervisor</h2>
            <p className="text-sm mb-2">Select a supervisor for <strong>{employeeToAssign?.name}</strong>:</p>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
              value={selectedSupervisor}
              onChange={(e) => setSelectedSupervisor(e.target.value)}
            >
              <option value="">-- Select Supervisor --</option>
              {allEmployees.map((sup) => (
                <option key={sup.id} value={sup.id}>
                  {sup.name}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-3">
              <Button
                size="sm"
                variant="flat"
                onClick={() => setAssignModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                color="success"
                onClick={async () => {
                  if (!employeeToAssign || !selectedSupervisor) return;
                  await handleAssignSupervisor(employeeToAssign, selectedSupervisor);
                }}
              >
                Assign
              </Button>

            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default EmployeesPage;
