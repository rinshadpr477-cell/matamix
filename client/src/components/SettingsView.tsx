import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Trash2,
  Download,
  Info,
  CheckCircle,
  Sliders,
  Database,
} from 'lucide-react';
import { Task } from '../types/task';

interface SettingsViewProps {
  tasks: Task[];
  onDelete: (id: string) => Promise<void>;
  onPurgeCompleted?: () => Promise<boolean>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  tasks,
  onDelete,
  onPurgeCompleted,
}) => {
  const [compactMode, setCompactMode] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [purgeError, setPurgeError] = useState<string | null>(null);

  const completedTasks = tasks.filter((t) => t.completed);

  const handleClearCompleted = async () => {
    setIsClearing(true);
    setPurgeError(null);
    try {
      if (onPurgeCompleted) {
        const success = await onPurgeCompleted();
        if (!success) {
          setPurgeError('Failed to purge completed tasks. Please try again.');
          return;
        }
      } else {
        for (const t of completedTasks) {
          await onDelete(t.id);
        }
      }
      setConfirmClearOpen(false);
    } catch {
      setPurgeError('An unexpected error occurred during purge.');
    } finally {
      setIsClearing(false);
    }
  };

  const handleExportBackup = () => {
    const backupData = {
      version: '1.2.0',
      exportedAt: new Date().toISOString(),
      tasks,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `taskflow-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#004e9f] uppercase tracking-wider mb-1">
          <Settings className="w-4 h-4" />
          <span>System Configuration</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Application Settings & Preferences
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage workspace display options, backend endpoints, and database maintenance tasks.
        </p>
      </div>

      {/* Grid of Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Workspace Display Preferences */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-[#004e9f]" />
            <h3 className="text-sm font-bold text-slate-900">Display & Interaction</h3>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs font-semibold text-slate-800">Compact View</p>
              <p className="text-[11px] text-slate-400">Reduce card padding for high-density screens</p>
            </div>
            <button
              onClick={() => {
                setCompactMode(!compactMode);
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 2000);
              }}
              className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-[#004e9f] ${
                compactMode ? 'bg-[#004e9f]' : 'bg-slate-200'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 left-1 ${
                  compactMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs font-semibold text-slate-800">Color Palette</p>
              <p className="text-[11px] text-slate-400">Enterprise High-Contrast (Professional Blue & Slate)</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#004e9f] border border-blue-200">
              #004e9f Active
            </span>
          </div>

          {saveSuccess && (
            <div className="flex items-center gap-1.5 text-xs text-[#34A853] font-medium pt-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Preferences updated</span>
            </div>
          )}
        </div>

        {/* Backend & Environment Specifications */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Database className="w-4 h-4 text-[#004e9f]" />
            <h3 className="text-sm font-bold text-slate-900">Environment & Connections</h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">API Endpoint</span>
              <span className="font-mono text-slate-800 font-semibold">http://localhost:5000</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Database Engine</span>
              <span className="font-mono text-slate-800 font-semibold">MongoDB v7.0</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Environment</span>
              <span className="font-semibold text-[#34A853]">development / production-ready</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Architecture</span>
              <span className="text-slate-700 font-medium">React 18 + Express + Mongoose</span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management & Bulk Maintenance Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-4">
          <Shield className="w-4 h-4 text-[#004e9f]" />
          <h3 className="text-sm font-bold text-slate-900">Database Maintenance & Bulk Operations</h3>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2">
          <div>
            <p className="text-xs font-semibold text-slate-800">Export Full Database Backup</p>
            <p className="text-[11px] text-slate-400">
              Save a full JSON dump of all {tasks.length} task records for offline archive or restore.
            </p>
          </div>
          <button
            onClick={handleExportBackup}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#004e9f]" />
            <span>Download Backup</span>
          </button>
        </div>

        <div className="my-3 border-t border-slate-100" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2">
          <div>
            <p className="text-xs font-semibold text-rose-700">Purge Completed Tasks</p>
            <p className="text-[11px] text-slate-400">
              Permanently delete all {completedTasks.length} completed tasks from MongoDB.
            </p>
          </div>

          {confirmClearOpen ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearCompleted}
                disabled={isClearing}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
              >
                {isClearing ? 'Deleting...' : 'Confirm Purge'}
              </button>
              <button
                onClick={() => setConfirmClearOpen(false)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmClearOpen(true)}
              disabled={completedTasks.length === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge Completed ({completedTasks.length})</span>
            </button>
          )}
        </div>

        {purgeError && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {purgeError}
          </div>
        )}
      </div>

      {/* App Version Info Card */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-400" />
          <span>TaskFlow Enterprise Suite &bull; Build 2026.10</span>
        </div>
        <span className="font-mono text-[11px] text-slate-400">MIT Licensed</span>
      </div>
    </div>
  );
};
