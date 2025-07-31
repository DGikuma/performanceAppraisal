import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard-layout';
import ThemeToggle from '../../components/themeToggle';
import { Input, Button, Spinner } from '@heroui/react';
import axios from 'axios';

// ✅ Alert Components & Icons
import { Alert, AlertTitle, AlertDescription } from "../../components/ui/alert";
import { CheckCircle, AlertTriangle } from "lucide-react";

const SettingsPage: React.FC = () => {
  const [companyName, setCompanyName] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [defaultLeaveDays, setDefaultLeaveDays] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage('');
        setStatusType('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/settings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const settings = response.data;
      setCompanyName(settings.companyName || '');
      setMaintenanceMode(settings.maintenanceMode || false);
      setDefaultLeaveDays(settings.defaultLeaveDays?.toString() || '');
    } catch (error) {
      setStatusMessage('Failed to load settings');
      setStatusType('error');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!companyName || !defaultLeaveDays) {
      setStatusMessage('Please fill all required fields');
      setStatusType('error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        companyName,
        maintenanceMode,
        defaultLeaveDays: Number(defaultLeaveDays),
      };

      const token = localStorage.getItem('token');

      await axios.post('http://localhost:5000/api/settings', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStatusMessage('Settings saved successfully!');
      setStatusType('success');
    } catch (error) {
      setStatusMessage('Failed to save settings');
      setStatusType('error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="System Settings">
      {/* ✅ Top Center Toast Alert */}
      {statusMessage && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
          <Alert
            variant={statusType === "error" ? "destructive" : "default"}
            onClose={() => {
              setStatusMessage("");
              setStatusType("");
            }}
            dismissible
          >
            <div className="flex items-start gap-4">
              <div className="pt-1">
                {statusType === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div>
                <AlertTitle className="font-semibold">
                  {statusType === 'success' ? 'Success' : 'Error'}
                </AlertTitle>
                <AlertDescription>{statusMessage}</AlertDescription>
              </div>
            </div>
          </Alert>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <ThemeToggle />
      </div>

      <h1 className="text-2xl font-bold mb-4">System Settings</h1>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" color="primary" />
        </div>
      ) : (
        <div className="space-y-6 max-w-xl">
          <div>
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <Input
              placeholder="Birdview Microinsurance"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Enable Maintenance Mode</label>
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="toggle toggle-lg toggle-success"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Default Leave Days</label>
            <Input
              type="number"
              placeholder="21"
              value={defaultLeaveDays}
              onChange={(e) => setDefaultLeaveDays(e.target.value)}
            />
          </div>
          <div className="pt-4">
            <Button
              color="primary"
              onClick={saveSettings}
              disabled={saving}
              isLoading={saving}
              className="relative overflow-hidden px-6 py-3 font-semibold text-white bg-gradient-to-r from-green-500 to-green-700 shadow-2xl rounded-xl hover:from-green-600 hover:to-green-800 transform hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,255,100,0.4)] transition-all duration-300 ease-in-out"
            >
              Save Settings
            </Button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SettingsPage;
