import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { EyeIcon } from "@heroicons/react/24/outline";

export default function ViewEmployeeCard({
  open,
  onClose,
  employee,
}: {
  open: boolean;
  onClose: () => void;
  employee: any;
}) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-8 border border-gray-200">
              <div className="flex items-center gap-2 mb-6">
                <EyeIcon className="w-6 h-6 text-green-600" />
                <Dialog.Title className="text-xl font-semibold text-gray-800">
                  Employee Details
                </Dialog.Title>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <label className="text-gray-500 block text-xs mb-1">Full Name</label>
                  <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                    {employee.name}
                  </div>
                </div>

                <div>
                  <label className="text-gray-500 block text-xs mb-1">Email Address</label>
                  <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                    {employee.email}
                  </div>
                </div>

                <div>
                  <label className="text-gray-500 block text-xs mb-1">Department</label>
                  <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                    {employee.department}
                  </div>
                </div>

                <div>
                  <label className="text-gray-500 block text-xs mb-1">Role</label>
                  <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                    {employee.role}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-gray-500 block text-xs mb-1">Supervisor</label>
                  <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                    {employee.supervisor_name || "None"}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-5 py-2 text-sm font-medium text-red-700 border border-red-300 bg-red-50 rounded-md hover:bg-red-100 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
