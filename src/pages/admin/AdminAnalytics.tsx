import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Cell,
} from "recharts";
import { Loader2, TrendingUp, Users, Target, Mail, Phone, Search, X } from "lucide-react";
import { supabase } from "../../lib/supabase";

type Range = "7d" | "30d" | "90d" | "all";

interface ClientRow {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  message: string | null;
  lead_source: string | null;
  sales_code: string | null;
  created_at: string;
}

interface EventRow {
  event_type: string;
  session_id: string | null;
  created_at: string;
}

const RANGE_DAYS: Record<Range, number | null> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
  all: null,
};

const RANGE_LABELS: Record<Range, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  all: "All time",
};

const BAR_COLORS = ["#4f46e5", "#7c3aed", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#6366f1"];

function startOfRange(range: Range): Date | null {
  const days = RANGE_DAYS[range];
  if (days == null) return null;
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export const AdminAnalytics = () => {
  const [range, setRange] = useState<Range>("30d");
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const since = startOfRange(range);

        let clientsQuery = supabase
          .from("clients")
          .select("id, first_name, last_name, email, phone, address, message, lead_source, sales_code, created_at")
          .order("created_at", { ascending: true });
        let eventsQuery = supabase
          .from("analytics_events")
          .select("event_type, session_id, created_at")
          .order("created_at", { ascending: true });

        if (since) {
          clientsQuery = clientsQuery.gte("created_at", since.toISOString());
          eventsQuery = eventsQuery.gte("created_at", since.toISOString());
        }

        const [clientsRes, eventsRes] = await Promise.all([clientsQuery, eventsQuery]);

        if (clientsRes.error) throw clientsRes.error;
        if (eventsRes.error) throw eventsRes.error;

        setClients((clientsRes.data as ClientRow[]) ?? []);
        setEvents((eventsRes.data as EventRow[]) ?? []);
      } catch (err) {
        console.error("Failed to load analytics:", err);
        setError(err instanceof Error ? err.message : "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [range]);

  // Lead source breakdown
  const leadSourceData = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of clients) {
      const key = c.lead_source?.trim() || "Not specified";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count);
  }, [clients]);

  // Submissions over time (per day, fills in zero-days)
  const submissionsOverTime = useMemo(() => {
    const days = RANGE_DAYS[range] ?? 90;
    const map = new Map<string, number>();
    const end = new Date();
    end.setHours(0, 0, 0, 0);
    const start = new Date(end);
    start.setDate(start.getDate() - (days - 1));

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      map.set(formatDay(d), 0);
    }
    for (const c of clients) {
      const key = formatDay(new Date(c.created_at));
      if (map.has(key)) map.set(key, (map.get(key) ?? 0) + 1);
    }
    return [...map.entries()].map(([date, count]) => ({
      date: date.slice(5),
      count,
    }));
  }, [clients, range]);

  // Conversion funnel — unique sessions for page_view / form_start, plus total submissions
  const funnelData = useMemo(() => {
    const visitSessions = new Set<string>();
    const startedSessions = new Set<string>();
    for (const e of events) {
      if (!e.session_id) continue;
      if (e.event_type === "page_view") visitSessions.add(e.session_id);
      if (e.event_type === "form_start") startedSessions.add(e.session_id);
    }
    return [
      { stage: "Visits", count: visitSessions.size },
      { stage: "Form starts", count: startedSessions.size },
      { stage: "Submissions", count: clients.length },
    ];
  }, [events, clients]);

  // Sales code usage
  const salesCodeData = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of clients) {
      const code = c.sales_code?.trim().toUpperCase();
      if (!code) continue;
      counts.set(code, (counts.get(code) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([code, count]) => ({ code, count }))
      .sort((a, b) => b.count - a.count);
  }, [clients]);

  const totalSubmissions = clients.length;
  const totalVisits = funnelData[0]?.count ?? 0;
  const conversionRate =
    totalVisits > 0 ? ((totalSubmissions / totalVisits) * 100).toFixed(1) : "—";

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-600">Track lead sources, submissions, and conversion.</p>
        </div>
        <div className="flex gap-2">
          {(Object.keys(RANGE_LABELS) as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                range === r
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {RANGE_LABELS[r]}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          {error}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              icon={Users}
              label="Total submissions"
              value={totalSubmissions.toString()}
              color="bg-indigo-500"
            />
            <StatCard
              icon={TrendingUp}
              label="Unique visitors"
              value={totalVisits.toString()}
              color="bg-sky-500"
            />
            <StatCard
              icon={Target}
              label="Visit → submission rate"
              value={typeof conversionRate === "string" ? `${conversionRate}${conversionRate === "—" ? "" : "%"}` : "—"}
              color="bg-emerald-500"
            />
          </div>

          {/* Lead Source Breakdown */}
          <ChartCard
            title="Lead source breakdown"
            subtitle="Where your leads say they heard about you"
            empty={leadSourceData.length === 0}
            emptyText="No submissions in this range yet."
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={leadSourceData} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="source"
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  tick={{ fill: "#475569", fontSize: 12 }}
                  height={60}
                />
                <YAxis allowDecimals={false} tick={{ fill: "#475569", fontSize: 12 }} />
                <Tooltip cursor={{ fill: "#f1f5f9" }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {leadSourceData.map((_, i) => (
                    <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Submissions over time */}
          <ChartCard
            title="Submissions over time"
            subtitle={`Daily consultation requests — ${RANGE_LABELS[range]}`}
            empty={submissionsOverTime.every((d) => d.count === 0)}
            emptyText="No submissions in this range yet."
          >
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={submissionsOverTime} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fill: "#475569", fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fill: "#475569", fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#4f46e5" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Conversion Funnel */}
          <ChartCard
            title="Conversion funnel"
            subtitle="Unique visitors → form starts → submissions"
            empty={funnelData.every((d) => d.count === 0)}
            emptyText="No funnel data yet. Tracking starts now."
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={funnelData} layout="vertical" margin={{ top: 10, right: 30, left: 70, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" allowDecimals={false} tick={{ fill: "#475569", fontSize: 12 }} />
                <YAxis type="category" dataKey="stage" tick={{ fill: "#475569", fontSize: 13 }} />
                <Tooltip cursor={{ fill: "#f1f5f9" }} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {funnelData.map((_, i) => (
                    <Cell key={i} fill={["#4f46e5", "#7c3aed", "#10b981"][i] || "#4f46e5"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Recent submissions */}
          <ChartCard
            title="Recent submissions"
            subtitle={`Latest leads — ${RANGE_LABELS[range]}`}
            empty={clients.length === 0}
            emptyText="No submissions in this range yet."
          >
            <RecentLeadsTable clients={clients} />
          </ChartCard>

          {/* Sales code usage (bonus) */}
          {salesCodeData.length > 0 && (
            <ChartCard
              title="Sales code usage"
              subtitle="Promo codes entered by leads"
              empty={false}
              emptyText=""
            >
              <div className="space-y-2">
                {salesCodeData.map(({ code, count }) => (
                  <div
                    key={code}
                    className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-lg px-4 py-2"
                  >
                    <span className="font-mono font-bold tracking-wider text-amber-900">
                      {code}
                    </span>
                    <span className="text-sm text-amber-700">
                      {count} {count === 1 ? "lead" : "leads"}
                    </span>
                  </div>
                ))}
              </div>
            </ChartCard>
          )}
        </div>
      )}
    </div>
  );
};

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: string;
}

const StatCard = ({ icon: Icon, label, value, color }: StatCardProps) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center gap-4">
    <div className={`p-3 rounded-lg ${color} text-white`}>
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

interface ChartCardProps {
  title: string;
  subtitle?: string;
  empty: boolean;
  emptyText: string;
  children: React.ReactNode;
}

const ChartCard = ({ title, subtitle, empty, emptyText, children }: ChartCardProps) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
    </div>
    {empty ? (
      <div className="text-center py-12 text-slate-400">{emptyText}</div>
    ) : (
      children
    )}
  </div>
);

interface RecentLeadsTableProps {
  clients: ClientRow[];
}

const RecentLeadsTable = ({ clients }: RecentLeadsTableProps) => {
  const [query, setQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [codeFilter, setCodeFilter] = useState<"all" | "with" | "without">("all");

  // Distinct sources present in the current dataset
  const availableSources = useMemo(() => {
    const set = new Set<string>();
    for (const c of clients) {
      const s = c.lead_source?.trim();
      if (s) set.add(s);
    }
    return [...set].sort();
  }, [clients]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...clients]
      .reverse() // newest first
      .filter((c) => {
        if (sourceFilter === "all") {
          // pass
        } else if (sourceFilter === "__none__") {
          if (c.lead_source?.trim()) return false;
        } else if (c.lead_source !== sourceFilter) {
          return false;
        }

        if (codeFilter === "with" && !c.sales_code?.trim()) return false;
        if (codeFilter === "without" && c.sales_code?.trim()) return false;

        if (!q) return true;
        const haystack = [
          c.first_name,
          c.last_name,
          c.email,
          c.phone,
          c.address,
          c.sales_code,
          c.lead_source,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      });
  }, [clients, query, sourceFilter, codeFilter]);

  const hasActiveFilters =
    query !== "" || sourceFilter !== "all" || codeFilter !== "all";

  return (
    <div>
      {/* Filter / search controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, phone, address…"
            className="w-full pl-9 pr-9 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
        >
          <option value="all">All sources</option>
          <option value="__none__">Not specified</option>
          {availableSources.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={codeFilter}
          onChange={(e) =>
            setCodeFilter(e.target.value as "all" | "with" | "without")
          }
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
        >
          <option value="all">Any sales code</option>
          <option value="with">With code</option>
          <option value="without">Without code</option>
        </select>
      </div>

      {/* Result count */}
      <div className="text-xs text-slate-500 mb-2 px-1">
        Showing {filtered.length} of {clients.length}
        {hasActiveFilters && (
          <button
            onClick={() => {
              setQuery("");
              setSourceFilter("all");
              setCodeFilter("all");
            }}
            className="ml-3 text-indigo-600 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="overflow-x-auto -mx-6">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            No leads match your filters.
          </div>
        ) : (
        <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-slate-500 border-b border-slate-200">
            <th className="px-6 py-2 font-medium">Name</th>
            <th className="px-6 py-2 font-medium">Contact</th>
            <th className="px-6 py-2 font-medium">Source</th>
            <th className="px-6 py-2 font-medium">Sales Code</th>
            <th className="px-6 py-2 font-medium">Submitted</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((c) => (
            <tr
              key={c.id}
              className="border-b border-slate-100 hover:bg-slate-50 align-top"
            >
              <td className="px-6 py-3">
                <div className="font-medium text-slate-900">
                  {[c.first_name, c.last_name].filter(Boolean).join(" ") || "—"}
                </div>
                {c.address && (
                  <div className="text-xs text-slate-500 mt-0.5">{c.address}</div>
                )}
              </td>
              <td className="px-6 py-3 text-slate-700">
                {c.email && (
                  <a
                    href={`mailto:${c.email}`}
                    className="flex items-center gap-1.5 text-indigo-600 hover:underline"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    {c.email}
                  </a>
                )}
                {c.phone && (
                  <a
                    href={`tel:${c.phone}`}
                    className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 mt-1"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {c.phone}
                  </a>
                )}
              </td>
              <td className="px-6 py-3 text-slate-700">
                {c.lead_source || <span className="text-slate-400">—</span>}
              </td>
              <td className="px-6 py-3">
                {c.sales_code ? (
                  <span className="inline-block px-2 py-0.5 bg-amber-50 border border-amber-200 rounded font-mono text-xs font-bold tracking-wider text-amber-900">
                    {c.sales_code.toUpperCase()}
                  </span>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </td>
              <td className="px-6 py-3 text-slate-600 whitespace-nowrap">
                {formatSubmittedAt(c.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        )}
      </div>
    </div>
  );
};

function formatSubmittedAt(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default AdminAnalytics;
