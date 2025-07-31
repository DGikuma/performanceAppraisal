import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard-layout";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Spinner,
} from "@heroui/react";
import axios from "axios";
import { useAuth } from "../../contexts/auth-context";
import ThemeToggle from "../../components/themeToggle";
import Lottie from "lottie-react";
import androidBotAnimation from "../../assets/androidBot.json"; // Adjust the path if needed

interface TeamMember {
  id: number;
  fullname: string;
  email: string;
  department: string;
  status: string;
}

const MyTeam = () => {
  const { token } = useAuth();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await axios.get("/api/supervisor/team", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Team API response:", res.data);

        if (Array.isArray(res.data)) {
          setTeam(res.data);
        } else if (res.data?.team && Array.isArray(res.data.team)) {
          setTeam(res.data.team);
        } else {
          console.warn("Unexpected API format, setting team to []");
          setTeam([]);
        }

      } catch (err) {
        console.error("Failed to fetch team", err);
        setTeam([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [token]);

  return (
    <DashboardLayout title="My Team">
      <div className="flex justify-between items-center mb-4">
        <ThemeToggle />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spinner />
        </div>
      ) : (
        <Table aria-label="Supervisor Team">
          <TableHeader>
            <TableColumn>Full Name</TableColumn>
            <TableColumn>Email</TableColumn>
            <TableColumn>Department</TableColumn>
            <TableColumn>Status</TableColumn>
          </TableHeader>
          <TableBody>
            {Array.isArray(team) && team.length > 0 ? (
              team.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.fullname}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.department}</TableCell>
                  <TableCell>
                    <Chip
                      color={
                        member.status === "active"
                          ? "success"
                          : member.status === "inactive"
                          ? "default"
                          : "warning"
                      }
                    >
                      {member.status}
                    </Chip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>
                  <div className="flex flex-col items-center py-6">
                    <Lottie
                      animationData={androidBotAnimation}
                      style={{ width: 150 }}
                      loop
                    />
                    <p className="mt-4 text-gray-500 text-sm">
                      No team members found.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </DashboardLayout>
  );
};

export default MyTeam;
