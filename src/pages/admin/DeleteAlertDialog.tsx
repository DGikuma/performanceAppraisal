import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function DeleteAlertDialog({ open, onClose, onConfirm, name }: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
}) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
            leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
              <div className="flex items-center space-x-4">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  Confirm Deletion
                </Dialog.Title>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                Are you sure you want to delete <strong>{name}</strong>? This action is permanent.
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  className="px-4 py-2 rounded-md text-sm bg-gray-100 hover:bg-gray-200"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-md text-sm bg-red-600 text-white hover:bg-red-700"
                  onClick={onConfirm}
                >
                  Delete
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
