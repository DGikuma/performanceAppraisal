import React, { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useAuth } from "../contexts/auth-context";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const { token, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const role = user?.role || "";

  const getNavClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-3 rounded-md transition-all duration-200 ease-in-out text-base ${
      isActive
        ? "bg-blue-100 text-blue-700 font-semibold"
        : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
    }`;

  const getDropdownItemClass = (path: string) =>
    `px-4 py-2 rounded-md transition text-sm ${
      currentPath === path
        ? "bg-blue-100 text-blue-700 font-semibold"
        : "hover:bg-gray-100 text-gray-700"
    }`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar isBordered className="h-20 px-4 md:px-8 z-50 relative">
        <NavbarBrand>
          <NavLink to="/" className="font-bold text-inherit flex items-center">
          <img
            src="/favicon.ico" 
            alt="Logo"
            className="w-8 h-8 mr-2"
          />
          <p className="text-lg sm:text-xl font-bold">Performance Appraisal Portal</p>
          </NavLink>
        </NavbarBrand>

        <NavbarContent justify="end">
          <NavbarItem className="hidden sm:flex items-center text-sm text-default-600">
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </NavbarItem>

          <NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button isIconOnly variant="light" radius="full" className="p-1">
                  <Icon icon="lucide:user-circle" className="w-10 h-10 text-gray-700" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="User Menu"
                className="w-56 z-[60] p-2 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col gap-2"
              >
                {/* Profile Info */}
                <DropdownItem
                  key="profile"
                  className="flex flex-col items-start px-4 py-3 hover:bg-gray-50 rounded-lg transition"
                  isReadOnly
                >
                  <p className="font-semibold text-lg text-gray-800">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </DropdownItem>

                {/* Logout */}
                <DropdownItem
                  key="logout"
                  color="danger"
                  onPress={handleLogout}
                  className="group flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition duration-200 ease-in-out transform hover:scale-[1.02] justify-center"
                >
                  <Icon
                    icon="lucide:log-out"
                    className="w-4 h-4 text-red-600 group-hover:text-white transition-colors duration-200"
                  />
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      {/* Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          </div>
          <nav className="mt-4 space-y-1">
            {role === "employee" && (
              <>
                <NavLink to="/employee" className={getNavClasses}>
                  <Icon icon="lucide:layout-dashboard" className="w-6 h-6 mr-3" />
                  Dashboard
                </NavLink>
                <NavLink to="/appraisal" className={getNavClasses}>
                  <Icon icon="lucide:file-text" className="w-6 h-6 mr-3" />
                  My Appraisals
                </NavLink>
              </>
            )}

            {role === "supervisor" && (
              <>
                <NavLink to="/supervisor" className={getNavClasses}>
                  <Icon icon="lucide:layout-dashboard" className="w-6 h-6 mr-3" />
                  Dashboard
                </NavLink>
                <NavLink to="/supervisor/team" className={getNavClasses}>
                  <Icon icon="lucide:users" className="w-6 h-6 mr-3" />
                  My Team
                </NavLink>
                <NavLink to="/supervisor/appraisals" className={getNavClasses}>
                  <Icon icon="lucide:clipboard-list" className="w-6 h-6 mr-3" />
                  Pending Appraisals
                </NavLink>
              </>
            )}

            {role === "admin" && (
              <>
                <NavLink to="/admin" className={getNavClasses}>
                  <Icon icon="lucide:layout-dashboard" className="w-6 h-6 mr-3" />
                  Dashboard
                </NavLink>
                <NavLink to="/admin/employees" className={getNavClasses}>
                  <Icon icon="lucide:users" className="w-6 h-6 mr-3" />
                  Employees
                </NavLink>
                <NavLink to="/admin/departments" className={getNavClasses}>
                  <Icon icon="lucide:building" className="w-6 h-6 mr-3" />
                  Departments
                </NavLink>
                <NavLink to="/admin/appraisals" className={getNavClasses}>
                  <Icon icon="lucide:clipboard-list" className="w-6 h-6 mr-3" />
                  All Appraisals
                </NavLink>
                <NavLink to="/admin/settings" className={getNavClasses}>
                  <Icon icon="lucide:settings" className="w-6 h-6 mr-3" />
                  System Settings
                </NavLink>
              </>
            )}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6">
          {/* Mobile Nav */}
          <div className="md:hidden mb-6 flex items-center justify-between">
            <Dropdown placement="bottom-start">
              <DropdownTrigger>
                <Button
                  variant="flat"
                  className="text-sm shadow-sm px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  startContent={<Icon icon="lucide:menu" className="w-5 h-5" />}
                >
                  Menu
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Mobile Navigation"
                className="z-[60] w-64 p-2 bg-white rounded-xl shadow-lg border border-gray-100"
              >
                {role === "employee" ? (
                  <>
                    <DropdownItem
                      key="employee-dashboard"
                      onPress={() => navigate("/employee")}
                      className={getDropdownItemClass("/employee")}
                    >
                      Dashboard
                    </DropdownItem>
                    <DropdownItem
                      key="employee-appraisals"
                      onPress={() => navigate("/appraisal")}
                      className={getDropdownItemClass("/appraisal")}
                    >
                      My Appraisals
                    </DropdownItem>
                  </>
                ) : null}

                {role === "supervisor" ? (
                  <>
                    <DropdownItem
                      key="supervisor-dashboard"
                      onPress={() => navigate("/supervisor")}
                      className={getDropdownItemClass("/supervisor")}
                    >
                      Dashboard
                    </DropdownItem>
                    <DropdownItem
                      key="supervisor-team"
                      onPress={() => navigate("/supervisor/team")}
                      className={getDropdownItemClass("/supervisor/team")}
                    >
                      My Team
                    </DropdownItem>
                    <DropdownItem
                      key="supervisor-appraisals"
                      onPress={() => navigate("/supervisor/appraisals")}
                      className={getDropdownItemClass("/supervisor/appraisals")}
                    >
                      Pending Appraisals
                    </DropdownItem>
                  </>
                ) : null}

                {role === "admin" ? (
                  <>
                    <DropdownItem
                      key="admin-dashboard"
                      onPress={() => navigate("/admin")}
                      className={getDropdownItemClass("/admin")}
                    >
                      Dashboard
                    </DropdownItem>
                    <DropdownItem
                      key="admin-employees"
                      onPress={() => navigate("/admin/employees")}
                      className={getDropdownItemClass("/admin/employees")}
                    >
                      Employees
                    </DropdownItem>
                    <DropdownItem
                      key="admin-departments"
                      onPress={() => navigate("/admin/departments")}
                      className={getDropdownItemClass("/admin/departments")}
                    >
                      Departments
                    </DropdownItem>
                    <DropdownItem
                      key="admin-appraisals"
                      onPress={() => navigate("/admin/appraisals")}
                      className={getDropdownItemClass("/admin/appraisals")}
                    >
                      All Appraisals
                    </DropdownItem>
                    <DropdownItem
                      key="admin-settings"
                      onPress={() => navigate("/admin/settings")}
                      className={getDropdownItemClass("/admin/settings")}
                    >
                      System Settings
                    </DropdownItem>
                  </>
                ) : null}
              </DropdownMenu>
            </Dropdown>

            <h1 className="text-lg font-semibold ml-4 truncate">{title}</h1>
          </div>

          {/* Page content */}
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
