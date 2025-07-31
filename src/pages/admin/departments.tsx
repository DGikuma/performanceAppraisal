import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard-layout';
import {
          Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
          Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalContent, Input
        } from '@heroui/react';
import { DownloadIcon, EditIcon } from 'lucide-react';
import { exportToCSV, exportToPDF } from '../../../backend/src/utils/exportUtils';
import ThemeToggle from '../../components/themeToggle';
import Lottie from "lottie-react";
import androidBotAnimation from "../../assets/androidBot.json";


type Department = {
  id: number;
  name: string;
  head: string;
  total_employees: number;
};

const DepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selected, setSelected] = useState<Department | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);

  const fetchDepartments = async () => {
    const token = localStorage.getItem("token"); 

    const res = await fetch("http://localhost:5000/api/departments", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch departments:", res.status);
      return;
    }

    const data = await res.json();
    setDepartments(data);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

    const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/users", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch users:", res.status);
      return;
    }

    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchDepartments();
    fetchUsers(); // fetch users too
  }, []);

  const handleEdit = (dept: Department) => {
    console.log("🛠️ Editing department:", dept); // ✅ Debug log
    setSelected({ ...dept });
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!selected) return;

    const token = localStorage.getItem("token"); // 🔐 Retrieve token

    const res = await fetch(`http://localhost:5000/api/departments/${selected.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // ✅ Add this line
      },
      body: JSON.stringify({ name: selected.name, head: selected.head }),
    });

    if (!res.ok) {
      console.error("Failed to update department:", res.status);
      return;
    }

    setEditOpen(false);
    fetchDepartments();
  };

  return (
    <DashboardLayout title="Departments">
            <div className="flex justify-between items-center mb-4">
        <ThemeToggle />
        </div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Departments</h1>
        <div className="flex gap-2">
        <Button
          onClick={() => exportToCSV(departments, 'departments')}
          className="relative px-4 py-2 font-semibold text-white bg-gradient-to-r from-green-500 to-green-700 rounded-lg shadow-xl hover:from-green-600 hover:to-green-800 transform hover:-translate-y-[2px] hover:shadow-[0_10px_20px_rgba(0,255,100,0.4)] transition-all duration-300 ease-in-out"
        >
          CSV <DownloadIcon className="ml-1" size={16} />
        </Button>

        <Button
          onClick={() =>
            exportToPDF(departments, 'Departments Report', ['name', 'head', 'total_employees'])
          }
          className="relative px-4 py-2 font-semibold text-white bg-gradient-to-r from-red-500 to-red-700 rounded-lg shadow-xl hover:from-red-600 hover:to-red-800 transform hover:-translate-y-[2px] hover:shadow-[0_10px_20px_rgba(255,50,50,0.4)] transition-all duration-300 ease-in-out ml-3"
        >
          PDF <DownloadIcon className="ml-1" size={16} />
        </Button>
        </div>
      </div>
      <div className="overflow-auto rounded-2xl shadow-2xl border border-gray-200 bg-white dark:bg-zinc-900 dark:border-zinc-800">
        <Table
          aria-label="Departments"
          className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700 text-sm"
        >
          <TableHeader className="bg-gradient-to-r from-blue-100 to-purple-200 dark:from-zinc-800 dark:to-zinc-900">
            <TableColumn className="font-bold text-left px-6 py-4 text-gray-700 dark:text-white">DEPARTMENT</TableColumn>
            <TableColumn className="font-bold text-left px-6 py-4 text-gray-700 dark:text-white">HEAD</TableColumn>
            <TableColumn className="font-bold text-left px-6 py-4 text-gray-700 dark:text-white">EMPLOYEES</TableColumn>
            <TableColumn className="font-bold text-left px-6 py-4 text-gray-700 dark:text-white">ACTION</TableColumn>
          </TableHeader>

          <TableBody>
            {departments.length > 0 ? (
              departments.map((dept, idx) => (
                <TableRow key={idx} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition duration-200">
                  <TableCell className="px-6 py-4">{dept.name}</TableCell>
                  <TableCell className="px-6 py-4">{dept.head}</TableCell>
                  <TableCell className="px-6 py-4">{dept.total_employees}</TableCell>
                  <TableCell className="px-6 py-4">
                    <Button
                      size="sm"
                      onClick={() => handleEdit(dept)}
                      className="group relative inline-flex items-center px-4 py-2 bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold rounded-xl shadow-xl hover:shadow-[0_10px_25px_rgba(59,130,246,0.4)] hover:from-blue-600 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out"
                    >
                      <EditIcon size={16} className="mr-1 group-hover:scale-110 transition-transform duration-300" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center">
                    <Lottie animationData={androidBotAnimation} style={{ width: 200, height: 200 }} loop />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No departments found.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Modal isOpen={editOpen} onOpenChange={(open) => setEditOpen(open)} backdrop="blur">
        <ModalContent className="rounded-2xl bg-gradient-to-br from-white via-blue-50 to-purple-100 shadow-2xl border border-blue-100 max-w-lg w-full mx-auto p-4">
          {(onClose) => (
            <>
              <ModalHeader className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-2">
                ✨ Edit Department
              </ModalHeader>
              <ModalBody className="space-y-4 mt-2">
                <Input
                  className="border border-gray-300 shadow-inner rounded-xl"
                  value={selected?.name || ''}
                  onChange={(e) =>
                    selected && setSelected({ ...selected, name: e.target.value })
                  }
                />
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-700">Department Head</label>
                  <select
                    className="border border-gray-300 rounded-xl px-4 py-2 shadow-inner bg-white"
                    value={selected?.head || ''}
                    onChange={(e) =>
                      selected && setSelected({ ...selected, head: e.target.value })
                    }
                  >
                    <option value="" disabled>Select a head</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.name}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-center gap-3 pt-2">
                <Button
                  onClick={() => {
                    handleUpdate();
                    onClose();
                  }}
                  className="bg-gradient-to-br from-green-500 to-green-700 text-white px-6 py-2 rounded-xl font-semibold shadow-xl hover:from-green-600 hover:to-green-800 transform hover:-translate-y-[2px] hover:shadow-[0_10px_25px_rgba(0,255,100,0.4)] transition-all duration-300 ease-in-out"
                >
                  Save
                </Button>
                <Button
                  onClick={onClose}
                  className="bg-gradient-to-br from-red-500 to-red-700 text-white px-6 py-2 rounded-xl font-semibold shadow-xl hover:from-red-600 hover:to-red-800 transform hover:-translate-y-[2px] hover:shadow-[0_10px_25px_rgba(255,0,0,0.4)] transition-all duration-300 ease-in-out"
                >
                  Cancel
                </Button>
                </div>

              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

    </DashboardLayout>
  );
};

export default DepartmentsPage;
