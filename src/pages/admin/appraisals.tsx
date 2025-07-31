import React, { Fragment, useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard-layout";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Input,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ThemeToggle from "../../components/themeToggle";
import { DownloadIcon } from "lucide-react";
import Lottie from "lottie-react";
import androidBotAnimation from "../../assets/androidBot.json";

const statusOptions = [
  { key: "all", label: "All" },
  { key: "not_started", label: "Not Started" },
  { key: "self_assessment", label: "Self Assessment" },
  { key: "supervisor_review", label: "Supervisor Review" },
  { key: "completed", label: "Completed" },
];

const AppraisalsPage: React.FC = () => {
  const [appraisals, setAppraisals] = useState<any[]>([]);
  const [filteredAppraisals, setFilteredAppraisals] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedAppraisal, setSelectedAppraisal] = useState<any>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchAppraisals = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/appraisals");
        const data = await res.json();
        setAppraisals(data);
        setFilteredAppraisals(data);
      } catch (err) {
        console.error("Failed to fetch appraisals:", err);
      }
    };
    fetchAppraisals();
  }, []);

  useEffect(() => {
    let filtered = [...appraisals];
    if (statusFilter !== "all") {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }
    if (dateFilter) {
      filtered = filtered.filter((a) => a.date.startsWith(dateFilter));
    }
    setFilteredAppraisals(filtered);
  }, [statusFilter, dateFilter, appraisals]);

  const handleEdit = (appraisal: any) => {
    setSelectedAppraisal(appraisal);
    onOpen();
  };

  const handleSaveScore = async () => {
    try {
      await fetch(`http://localhost:5000/api/appraisal/${selectedAppraisal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: selectedAppraisal.score }),
      });
      onClose();
    } catch (err) {
      console.error("Failed to update score:", err);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["EMPLOYEE", "REVIEWER", "STATUS", "SCORE", "DATE"]],
      body: filteredAppraisals.map((a) => [
        a.employee_name,
        a.reviewer_name,
        a.status,
        a.score ?? "-",
        new Date(a.date).toLocaleDateString(),
      ]),
    });
    doc.save("appraisals.pdf");
  };

  const exportToCSV = () => {
    const rows = [
      ["EMPLOYEE", "REVIEWER", "STATUS", "SCORE", "DATE"],
      ...filteredAppraisals.map((a) => [
        a.employee_name,
        a.reviewer_name,
        a.status,
        a.score ?? "-",
        new Date(a.date).toLocaleDateString(),
      ]),
    ];
    const csvContent = rows.map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "appraisals.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout title="All Appraisals">      <div className="flex justify-between items-center mb-4">
        <ThemeToggle />
        </div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Appraisal Records</h1>
        <div className="space-x-2">
        <Button
          onClick={exportToCSV}
          size="sm"
          color="primary"
          variant="flat"
          className="relative px-4 py-2 font-semibold text-white bg-gradient-to-r from-green-500 to-green-700 rounded-lg shadow-xl hover:from-green-600 hover:to-green-800 transform hover:-translate-y-[2px] hover:shadow-[0_10px_20px_rgba(0,255,100,0.4)] transition-all duration-300 ease-in-out ml-3"
        >
          CSV <DownloadIcon className="ml-1" size={16} />
        </Button>

        <Button
          onClick={exportToPDF}
          size="sm"
          color="primary"
          variant="flat"
          className="relative px-4 py-2 font-semibold text-white bg-gradient-to-r from-red-500 to-red-700 rounded-lg shadow-xl hover:from-red-600 hover:to-red-800 transform hover:-translate-y-[2px] hover:shadow-[0_10px_20px_rgba(255,50,50,0.4)] transition-all duration-300 ease-in-out"
        >
          PDF <DownloadIcon className="ml-1" size={16} />
        </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap md:flex-nowrap gap-4 mb-6">
        {/* ✅ Replaced with Hero UI Listbox */}
        <div className="w-full md:w-60">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Review Status
          </label>
          <Listbox value={statusFilter} onChange={setStatusFilter}>
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-default rounded-md bg-white border border-gray-300 py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <span className="block truncate">
                  {statusOptions.find((o) => o.key === statusFilter)?.label || "Select Status"}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm !animate-none">
                  {statusOptions.map((option) => (
                    <Listbox.Option
                      key={option.key}
                      value={option.key}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                            {option.label}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>

        {/* Date filter */}
        <div className="w-full md:w-60 bg-white">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date Filter
          </label>
        <Input
          type="month"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          size="md"
          className="w-full bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
        </div>
      </div>

      {/* Appraisal Table */}
        <Table
          aria-label="Appraisal Records"
          className="rounded-xl overflow-hidden border border-gray-200 shadow-md"
        >
          <TableHeader className="bg-gradient-to-r from-blue-50 to-blue-100 text-gray-700 font-semibold text-sm uppercase tracking-wide">
            <TableColumn className="px-4 py-3">Employee</TableColumn>
            <TableColumn className="px-4 py-3">Reviewer</TableColumn>
            <TableColumn className="px-4 py-3">Status</TableColumn>
            <TableColumn className="px-4 py-3">Score</TableColumn>
            <TableColumn className="px-4 py-3">Date</TableColumn>
          </TableHeader>

          <TableBody>
            {filteredAppraisals.length > 0 ? (
              filteredAppraisals.map((a, idx) => (
                <TableRow
                  key={idx}
                  onClick={() => handleEdit(a)}
                  className="cursor-pointer transition-all duration-300 hover:bg-blue-50 hover:shadow-sm group"
                >
                  <TableCell className="px-4 py-3 text-sm text-gray-800 font-medium">
                    {a.employee_name}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-sm text-gray-600">
                    {a.reviewer_name}
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    <Chip
                      className={`text-xs font-semibold px-2 py-1 rounded-md ${
                        a.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700 animate-pulse"
                      }`}
                    >
                      {a.status
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </Chip>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-sm text-gray-700">
                    {a.score ?? <span className="text-gray-400 italic">—</span>}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-sm text-gray-500">
                    {new Date(a.date).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Lottie
                      animationData={androidBotAnimation}
                      style={{ width: 180, height: 180 }}
                      loop
                    />
                    <p className="mt-4 text-gray-500 text-sm italic">
                      No appraisal records found.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

      {/* Score Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalHeader>Edit Score</ModalHeader>
        <ModalBody>
          <Input
            label="Score"
            type="number"
            value={selectedAppraisal?.score || ""}
            onChange={(e) =>
              setSelectedAppraisal((prev: any) => ({ ...prev, score: e.target.value }))
            }
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSaveScore}>Save</Button>
        </ModalFooter>
      </Modal>
    </DashboardLayout>
  );
};

export default AppraisalsPage;
