import { useState, useEffect, useMemo } from 'react';
import {
  fetchAdminMessages,
  updateAdminMessageStatus,
  deleteAdminMessage,
  seedTestInquiry,
} from '@/lib/api';
import type {
  ContactMessageRecord,
  AdminStats,
  DbStatus,
} from '@/lib/api';
import {
  Inbox,
  Mail,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  Archive,
  RefreshCw,
  Search,
  LogOut,
  Send,
  Database,
  Download,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminDashboardProps {
  token: string;
  user: { username: string; role: string };
  onLogout: () => void;
}

export default function AdminDashboard({ token, user, onLogout }: AdminDashboardProps) {
  const [messages, setMessages] = useState<ContactMessageRecord[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    total: 0,
    unread: 0,
    read: 0,
    archived: 0,
    replied: 0,
  });
  const [dbStatus, setDbStatus] = useState<DbStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read' | 'archived' | 'replied'>('all');

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetchAdminMessages(token);
      if (res && res.messages) {
        setMessages(res.messages);
        setStats(res.stats || calculateStats(res.messages));
        if (res.dbStatus) setDbStatus(res.dbStatus);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const calculateStats = (list: ContactMessageRecord[]): AdminStats => {
    return {
      total: list.length,
      unread: list.filter((m) => m.status === 'unread').length,
      read: list.filter((m) => m.status === 'read').length,
      archived: list.filter((m) => m.status === 'archived').length,
      replied: list.filter((m) => m.status === 'replied').length,
    };
  };

  const handleStatusChange = async (
    id: string | number,
    newStatus: 'unread' | 'read' | 'archived' | 'replied'
  ) => {
    const updated = messages.map((m) => (m.id === id ? { ...m, status: newStatus } : m));
    setMessages(updated);
    setStats(calculateStats(updated));
    await updateAdminMessageStatus(token, id, newStatus);
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('Are you sure you want to delete this message record?')) return;
    const updated = messages.filter((m) => m.id !== id);
    setMessages(updated);
    setStats(calculateStats(updated));
    await deleteAdminMessage(token, id);
  };

  const handleAddSample = async () => {
    const newMsg = await seedTestInquiry(token);
    if (newMsg) {
      const updated = [newMsg, ...messages];
      setMessages(updated);
      setStats(calculateStats(updated));
    } else {
      // Local fallback
      const mock: ContactMessageRecord = {
        id: Date.now(),
        fullName: 'Dr. Alistair Vance',
        company: 'Vance BioPharma Group',
        email: 'a.vance@vancebiopharma.org',
        message: 'We are evaluating automated validation platforms for SAP S/4HANA Life Sciences compliance. Please schedule an architecture discussion with your principal consultant.',
        status: 'unread',
        createdAt: new Date().toISOString(),
      };
      const updated = [mock, ...messages];
      setMessages(updated);
      setStats(calculateStats(updated));
    }
  };

  const exportCSV = () => {
    const headers = ['ID', 'Full Name', 'Company', 'Email', 'Status', 'Date', 'Message'];
    const rows = filteredMessages.map((m) => [
      m.id,
      `"${m.fullName.replace(/"/g, '""')}"`,
      `"${(m.company || '').replace(/"/g, '""')}"`,
      `"${m.email.replace(/"/g, '""')}"`,
      m.status,
      `"${new Date(m.createdAt).toLocaleString()}"`,
      `"${m.message.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `axia-kairos-contacts-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered list
  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      const matchesFilter = statusFilter === 'all' ? true : m.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        m.fullName.toLowerCase().includes(q) ||
        (m.company && m.company.toLowerCase().includes(q)) ||
        m.email.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [messages, statusFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#07090e] text-zinc-900 dark:text-zinc-100 transition-colors">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-[#07090e]/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold text-sm tracking-tighter">
            AK
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight">Axia Kairos Admin</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-sky-500/10 text-sky-500 border border-sky-500/20">
                Portal
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Inquiries & Client Contact Submissions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Database indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs">
            <Database className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-zinc-600 dark:text-zinc-300 font-medium">
              {dbStatus?.isPostgresReady ? 'PostgreSQL Live' : 'Storage Active'}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{user.username}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="h-9 px-3 gap-1.5 text-xs rounded-lg border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleAddSample}
            className="h-9 px-3 gap-1.5 text-xs rounded-lg border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <PlusCircle className="w-3.5 h-3.5 text-sky-500" />
            <span className="hidden sm:inline">Test Message</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="h-9 px-3 gap-1.5 text-xs rounded-lg border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-rose-500 dark:hover:text-rose-400"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c1017] p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <span>Total Inquiries</span>
              <Inbox className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {stats.total}
            </div>
            <div className="mt-1 text-[11px] text-zinc-400">All messages submitted</div>
          </div>

          <div className="rounded-2xl border border-sky-200 dark:border-sky-900/40 bg-sky-50/50 dark:bg-sky-950/15 p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs font-semibold text-sky-600 dark:text-sky-400">
              <span>Needs Attention</span>
              <Clock className="w-4 h-4 text-sky-500" />
            </div>
            <div className="mt-3 text-3xl font-bold tracking-tight text-sky-600 dark:text-sky-400">
              {stats.unread}
            </div>
            <div className="mt-1 text-[11px] text-sky-500/80">Unread inquiries</div>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c1017] p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <span>Replied / In Touch</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {stats.replied}
            </div>
            <div className="mt-1 text-[11px] text-zinc-400">Consultant outreach sent</div>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c1017] p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <span>Archived</span>
              <Archive className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {stats.archived}
            </div>
            <div className="mt-1 text-[11px] text-zinc-400">Resolved interactions</div>
          </div>
        </div>

        {/* Controls: Search, Filters, CSV Export */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white dark:bg-[#0c1017] p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search sender, company, email, or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
            />
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'unread', label: `Unread (${stats.unread})` },
                { id: 'read', label: 'Read' },
                { id: 'replied', label: 'Replied' },
                { id: 'archived', label: 'Archived' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === tab.id
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* CSV Download */}
          <Button
            variant="outline"
            size="sm"
            onClick={exportCSV}
            className="h-10 px-3.5 gap-2 text-xs rounded-xl border-zinc-200 dark:border-zinc-700 shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>
        </div>

        {/* Message Feed / Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 px-1">
            <span>
              Showing {filteredMessages.length} of {messages.length} messages
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-sky-500 hover:underline cursor-pointer"
              >
                Clear search
              </button>
            )}
          </div>

          {loading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-zinc-300 dark:border-zinc-700 border-t-sky-500 animate-spin" />
              <p className="text-sm text-zinc-500">Loading inquiries from database...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-[#0c1017]/50 p-12 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                <Inbox className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                No inquiries found
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
                {searchQuery
                  ? `No messages matched "${searchQuery}". Try adjusting your search query.`
                  : 'No contact form messages have been submitted under this filter.'}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddSample}
                className="mt-2 text-xs rounded-xl"
              >
                <PlusCircle className="w-3.5 h-3.5 mr-1.5 text-sky-500" />
                Add Sample Enterprise Inquiry
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredMessages.map((msg) => {
                const isUnread = msg.status === 'unread';

                return (
                  <div
                    key={msg.id}
                    className={`rounded-2xl border transition-all duration-200 p-5 sm:p-6 bg-white dark:bg-[#0c1017] shadow-xs ${
                      isUnread
                        ? 'border-sky-300/80 dark:border-sky-900/50 bg-sky-50/15 dark:bg-sky-950/5'
                        : 'border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      {/* Left: Sender & Metadata */}
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                            isUnread
                              ? 'bg-sky-500 text-white shadow-sm'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                          }`}
                        >
                          {msg.fullName
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase() || 'U'}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                              {msg.fullName}
                            </h3>
                            {msg.company && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60">
                                <Building2 className="w-3 h-3 text-zinc-400" />
                                {msg.company}
                              </span>
                            )}
                            <span
                              className={`text-[11px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                                msg.status === 'unread'
                                  ? 'bg-sky-500/10 text-sky-500 border border-sky-500/20'
                                  : msg.status === 'replied'
                                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                  : msg.status === 'archived'
                                  ? 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                                  : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                              }`}
                            >
                              {msg.status}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 flex-wrap">
                            <a
                              href={`mailto:${msg.email}?subject=${encodeURIComponent(
                                'Axia Kairos Consultation Follow-up'
                              )}`}
                              className="inline-flex items-center gap-1.5 hover:text-sky-500 transition-colors font-mono"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              {msg.email}
                            </a>
                            <span className="inline-flex items-center gap-1.5 font-mono">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(msg.createdAt).toLocaleString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                        {/* Status Toggle buttons */}
                        {msg.status === 'unread' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(msg.id, 'read')}
                            className="h-8 px-2.5 text-xs rounded-lg"
                            title="Mark as Read"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                            Mark Read
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(msg.id, 'unread')}
                            className="h-8 px-2.5 text-xs rounded-lg"
                            title="Mark as Unread"
                          >
                            <Clock className="w-3.5 h-3.5 mr-1 text-sky-500" />
                            Mark Unread
                          </Button>
                        )}

                        {msg.status !== 'replied' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(msg.id, 'replied')}
                            className="h-8 px-2.5 text-xs rounded-lg"
                            title="Mark as Replied"
                          >
                            <Send className="w-3.5 h-3.5 mr-1 text-blue-500" />
                            Replied
                          </Button>
                        )}

                        <a
                          href={`mailto:${msg.email}?subject=${encodeURIComponent(
                            'Axia Kairos: Transformation Inquiry Response'
                          )}&body=${encodeURIComponent(
                            `Hello ${msg.fullName},\n\nThank you for reaching out to Axia Kairos regarding:\n"${msg.message}"\n\nWe would like to schedule an introductory consultation with our leadership team.\n\nBest regards,\nAxia Kairos Advisory Group`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center h-8 px-2.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                          title="Reply via Email Client"
                        >
                          <ExternalLink className="w-3.5 h-3.5 mr-1" />
                          Reply
                        </a>

                        {msg.status !== 'archived' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleStatusChange(msg.id, 'archived')}
                            className="h-8 w-8 p-0 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                            title="Archive"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(msg.id)}
                          className="h-8 w-8 p-0 rounded-lg text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400"
                          title="Delete message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Message Body */}
                    <div className="mt-4 pt-3.5 border-t border-zinc-100 dark:border-zinc-800/80">
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap font-sans">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
