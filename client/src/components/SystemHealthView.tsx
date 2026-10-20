import React, { useState, useEffect } from 'react';
import {
  Activity,
  Database,
  Server,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Code,
  ShieldCheck,
  Cpu,
} from 'lucide-react';

interface HealthData {
  status: string;
  uptime: number;
  timestamp: string;
  database?: {
    status: string;
    readyState: number;
  };
  services?: {
    database: {
      status: string;
      readyState: number;
    };
  };
}

export const SystemHealthView: React.FC = () => {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    setIsLoading(true);
    setError(null);
    const start = performance.now();
    try {
      const response = await fetch('/health', {
        headers: { Accept: 'application/json' },
      });
      const end = performance.now();
      setLatency(Math.round(end - start));

      if (!response.ok) {
        throw new Error(`Health check returned status ${response.status}`);
      }
      const data: HealthData = await response.json();
      setHealth(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Health check failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const formatUptime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const hours = Math.floor(mins / 60);
    if (hours > 0) return `${hours}h ${mins % 60}m`;
    if (mins > 0) return `${mins}m ${Math.floor(seconds % 60)}s`;
    return `${Math.floor(seconds)}s`;
  };

  const readyState = health?.database?.readyState ?? health?.services?.database?.readyState ?? 0;
  const isDbConnected = readyState === 1;
  const isServerHealthy = health?.status === 'healthy' || health?.status === 'ok';

  const endpoints = [
    {
      method: 'GET',
      path: '/api/tasks',
      description: 'Fetch all tasks from MongoDB (supports ?page & ?limit query params)',
      auth: 'Public / None',
      status: '200 OK',
    },
    {
      method: 'POST',
      path: '/api/tasks',
      description: 'Create a new task with validated title (Zod schema: 1-100 characters)',
      auth: 'Public / None',
      status: '201 Created',
    },
    {
      method: 'PATCH',
      path: '/api/tasks/:id',
      description: 'Update or toggle task completion status atomically',
      auth: 'Public / None',
      status: '200 OK',
    },
    {
      method: 'DELETE',
      path: '/api/tasks/:id',
      description: 'Permanently remove a task record by MongoDB ObjectId',
      auth: 'Public / None',
      status: '200 OK',
    },
    {
      method: 'GET',
      path: '/health',
      description: 'Deep health check probe verifying MongoDB database readyState',
      auth: 'Public / Probe',
      status: '200 OK',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Diagnostic Action Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#004e9f] uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" />
            <span>Infrastructure Diagnostics</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            System Health & API Specifications
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-lg">
            Directly probing Express backend server and MongoDB Mongoose connection status.
          </p>
        </div>

        <button
          onClick={checkHealth}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#004e9f] hover:bg-[#003d7c] text-white text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Run Diagnostic Ping</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Backend Server Status */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Express Server</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#004e9f] flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isServerHealthy ? 'bg-[#34A853]' : 'bg-rose-500'
              }`}
            />
            <span className="text-lg font-bold text-slate-900">
              {isServerHealthy ? 'Operational' : error ? 'Degraded' : 'Checking...'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Port 5000 &bull; Node.js runtime</p>
        </div>

        {/* MongoDB Status */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">MongoDB Database</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#34A853] flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isDbConnected ? 'bg-[#34A853]' : 'bg-amber-500'
              }`}
            />
            <span className="text-lg font-bold text-slate-900">
              {isDbConnected ? 'Connected' : 'Connecting'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Mongoose readyState: {readyState}
          </p>
        </div>

        {/* Server Uptime */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Server Uptime</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-slate-900">
            {health ? formatUptime(health.uptime) : '—'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Continuous zero-downtime execution</p>
        </div>

        {/* Roundtrip Latency */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">HTTP Latency</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-slate-900">
            {latency !== null ? `${latency} ms` : '—'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">CORS-validated REST handshake</p>
        </div>
      </div>

      {/* Error alert if health check fails */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>Diagnostic warning: {error}</span>
        </div>
      )}

      {/* API Endpoints Contract Specification Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-[#004e9f]" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Registered REST API Endpoints
            </span>
          </div>
          <span className="text-[11px] font-semibold text-[#34A853] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
            All Contracts Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Route</th>
                <th className="py-3 px-4">Description & Validation</th>
                <th className="py-3 px-4">Expected Response</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {endpoints.map((ep) => (
                <tr key={ep.path + ep.method} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        ep.method === 'GET'
                          ? 'bg-blue-100 text-[#004e9f]'
                          : ep.method === 'POST'
                          ? 'bg-emerald-100 text-[#34A853]'
                          : ep.method === 'PATCH'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {ep.method}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800 whitespace-nowrap">
                    {ep.path}
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-600">
                    {ep.description}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[#34A853] font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{ep.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
