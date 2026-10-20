import React, { useState, useMemo } from 'react';
import { Task } from '../types/task';
import {
  FileSpreadsheet,
  FileCode,
  Search,
  Calendar,
  Clock,
  Archive,
} from 'lucide-react';

interface HistoryViewProps {
  tasks: Task[];
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  tasks,
  onToggle,
  onDelete,
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'active'>('all');

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filter === 'completed' && !t.completed) return false;
      if (filter === 'active' && t.completed) return false;
      if (search.trim()) {
        return t.title.toLowerCase().includes(search.toLowerCase().trim());
      }
      return true;
    });
  }, [tasks, filter, search]);

  const completedCount = tasks.filter((t) => t.completed).length;

  const sanitizeCSVField = (val: string): string => {
    // Mitigate CSV Formula Injection (CWE-1236)
    const formulaChars = ['=', '+', '-', '@', '\t', '\r'];
    let safeVal = val;
    if (formulaChars.some((char) => safeVal.startsWith(char))) {
      safeVal = `'${safeVal}`;
    }
    return `"${safeVal.replace(/"/g, '""')}"`;
  };

  const exportCSV = () => {
    const headers = ['ID', 'Title', 'Status', 'Created At', 'Updated At'];
    const rows = tasks.map((t) => [
      sanitizeCSVField(t.id),
      sanitizeCSVField(t.title),
      t.completed ? '"Completed"' : '"In Progress"',
      sanitizeCSVField(t.createdAt),
      sanitizeCSVField(t.updatedAt),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `taskflow-export-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `taskflow-export-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Export Controls Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#004e9f] uppercase tracking-wider mb-1">
            <Archive className="w-4 h-4" />
            <span>Audit & Records</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            History & Data Export
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-md">
            Query your historical task activities, audit completion timestamps, and export data in CSV or JSON format.
          </p>
        </div>

        {/* Action Export Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={exportCSV}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
            title="Download CSV file of all tasks"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#34A853]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={exportJSON}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#004e9f] hover:bg-[#003d7c] text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
            title="Download raw JSON file"
          >
            <FileCode className="w-4 h-4 text-white" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search records by title..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004e9f] focus:border-transparent transition-all"
          />
        </div>

        {/* Segmented Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Records ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'completed'
                ? 'bg-white text-[#34A853] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed ({completedCount})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'active'
                ? 'bg-white text-[#004e9f] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active ({tasks.length - completedCount})
          </button>
        </div>
      </div>

      {/* History Data Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-700 tracking-wide uppercase">
            Showing {filteredTasks.length} record{filteredTasks.length === 1 ? '' : 's'}
          </div>
          <span className="text-[11px] text-slate-400">
            Realtime sync with MongoDB
          </span>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <Archive className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700">No records found</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Try adjusting your query or filter parameters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                <tr>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Task Title</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map((t) => {
                  const created = new Date(t.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  const updated = new Date(t.updatedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr
                      key={t.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            t.completed
                              ? 'bg-emerald-50 text-[#34A853] border border-emerald-200/60'
                              : 'bg-blue-50 text-[#004e9f] border border-blue-200/60'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              t.completed ? 'bg-[#34A853]' : 'bg-[#004e9f]'
                            }`}
                          />
                          {t.completed ? 'Completed' : 'Active'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-900 max-w-md break-words">
                        <span className={t.completed ? 'line-through text-slate-400' : ''}>
                          {t.title}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{created}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-300" />
                          <span>{updated}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => onToggle(t.id)}
                          className="text-[11px] font-semibold text-[#004e9f] hover:underline mr-3"
                        >
                          {t.completed ? 'Reopen' : 'Complete'}
                        </button>
                        <button
                          onClick={() => onDelete(t.id)}
                          className="text-[11px] font-semibold text-rose-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
