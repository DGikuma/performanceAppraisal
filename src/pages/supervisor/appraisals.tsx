import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard-layout";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Spinner,
  Chip,
} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/auth-context";
import ThemeToggle from "../../components/themeToggle";
import Lottie from "lottie-react";
import androidBotAnimation from "../../assets/androidBot.json"; // Make sure this path is correct

interface Appraisal {
  id: number;
  employee_name: string;
  status: string;
  created_at: string;
  period_name: string;
}

const PendingAppraisals = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [appraisals, setAppraisals] = useState<Appraisal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppraisals = async () => {
      try {
        const res = await axios.get("/api/supervisor/appraisals", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Appraisals response:", res.data);

        if (Array.isArray(res.data)) {
          setAppraisals(res.data);
        } else if (Array.isArray(res.data?.appraisals)) {
          setAppraisals(res.data.appraisals);
        } else {
          console.warn("Unexpected response format:", res.data);
          setAppraisals([]);
        }
      } catch (err) {
        console.error("Failed to fetch appraisals", err);
        setAppraisals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppraisals();
  }, [token]);

  return (
    <DashboardLayout title="Pending Appraisals">
      <div className="flex justify-between items-center mb-4">
        <ThemeToggle />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spinner />
        </div>
      ) : (
        <Table aria-label="Pending Appraisals Table">
          <TableHeader>
            <TableColumn>Employee</TableColumn>
            <TableColumn>Period</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Date</TableColumn>
            <TableColumn>Action</TableColumn>
          </TableHeader>
          <TableBody>
            {Array.isArray(appraisals) && appraisals.length > 0 ? (
              appraisals.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.employee_name}</TableCell>
                  <TableCell>{item.period_name}</TableCell>
                  <TableCell>
                    <Chip color="warning" variant="flat">
                      {item.status.replace("_", " ")}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    {new Date(item.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      color="primary"
                      size="sm"
                      onPress={() => navigate(`/supervisor/appraise/${item.id}`)}
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="flex flex-col items-center py-6">
                    <Lottie
                      animationData={androidBotAnimation}
                      style={{ width: 150 }}
                      loop
                    />
                    <p className="mt-4 text-gray-500 text-sm">
                      No pending appraisals found.
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

export default PendingAppraisals;
