import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Crown, Users, Scale, FileText, Activity, TrendingUp } from "lucide-react";
import { useSessionStore } from "@/store/sessionStore";
import PageHeader from "@/components/PageHeader";
import CountUp from "@/components/CountUp";

function Gauge({ value, label }: { value: number; label: string }) {
  const clamped = Math.max(-100, Math.min(100, value));
  const angle = (clamped / 100) * 90; // -90 to +90
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-16 overflow-hidden">
        <div className="absolute inset-0 rounded-t-full bg-gradient-to-r from-lords-red via-gold to-commons-green opacity-80" />
        <motion.div
          initial={{ rotate: -90 }}
          animate={{ rotate: angle }}
          transition={{ type: "spring", stiffness: 60, damping: 12 }}
          className="absolute bottom-0 left-1/2 w-1 h-14 bg-ink origin-bottom -translate-x-1/2"
          style={{ borderRadius: "999px" }}
        />
        <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-ink rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>
      <div className="font-inscription text-[10px] uppercase tracking-widest text-ink-muted mt-1">
        {label}
      </div>
      <div className="font-mono text-lg font-bold">{clamped > 0 ? `+${clamped}` : clamped}</div>
    </div>
  );
}

export default function Analytics() {
  const session = useSessionStore((s) => s.session);

  if (!session) {
    return (
      <div className="text-center py-20">
        <p className="font-body text-xl text-ink-muted">尚未创建议会会话</p>
      </div>
    );
  }

  const seatData = session.parties.map((p) => ({
    name: p.name,
    value: p.seats,
    color: p.color,
  }));

  const voteData = session.motions
    .filter((m) => m.vote)
    .map((m) => ({
      name: m.title.length > 10 ? m.title.slice(0, 10) + "..." : m.title,
      aye: m.vote?.aye || 0,
      no: m.vote?.no || 0,
      abstain: m.vote?.abstain || 0,
    }));

  const passedCount = session.motions.filter((m) => m.vote?.passed).length;
  const totalVotes = session.motions.filter((m) => m.vote).length;
  const attendance = Math.round(
    (session.members.filter((m) => m.isPresent).length / session.members.length) * 100
  );

  const kpi = [
    { icon: Users, label: "议员总数", value: session.members.length },
    { icon: Crown, label: "政党数量", value: session.parties.length },
    { icon: Scale, label: "议案通过率", value: totalVotes > 0 ? Math.round((passedCount / totalVotes) * 100) : 0, suffix: "%" },
    { icon: FileText, label: "议事录条目", value: session.hansard.length },
  ];

  return (
    <div>
      <PageHeader title="统计看板" subtitle="Analytics" ornament="Data & Trends" />

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpi.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4 }}
            className="card-parchment p-4"
          >
            <item.icon className="w-5 h-5 text-gold-dark mb-2" />
            <div className="font-mono text-2xl font-bold">
              <CountUp target={item.value} />
              {item.suffix || ""}
            </div>
            <div className="font-inscription text-[10px] text-ink-muted uppercase tracking-wider">
              {item.label}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Public opinion + attendance */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-parchment p-5 lg:col-span-1 flex flex-col items-center justify-center gap-6"
        >
          <Gauge value={session.publicOpinion} label="公众舆论" />
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-ink-muted">
                <Activity className="w-4 h-4" /> 出席率
              </span>
              <span className="font-mono font-bold">{attendance}%</span>
            </div>
            <div className="w-full h-2 bg-ink/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${attendance}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-gold to-commons-green"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-ink-muted">
                <TrendingUp className="w-4 h-4" /> 已表决议案
              </span>
              <span className="font-mono font-bold">{totalVotes}</span>
            </div>
          </div>
        </motion.div>

        {/* Seat distribution */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-parchment p-5 lg:col-span-1"
        >
          <h3 className="font-display font-bold mb-2">席位分布</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={seatData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {seatData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#F3EFE4" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#F3EFE4",
                    border: "1px solid rgba(26,23,20,0.1)",
                    borderRadius: "4px",
                    fontFamily: "Cormorant Garamond",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {seatData.map((s) => (
              <div key={s.name} className="flex items-center gap-1 text-xs font-body">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                {s.name} ({s.value})
              </div>
            ))}
          </div>
        </motion.div>

        {/* Vote history */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-parchment p-5 lg:col-span-1"
        >
          <h3 className="font-display font-bold mb-2">表决历史</h3>
          {voteData.length > 0 ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={voteData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,23,20,0.1)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#F3EFE4",
                      border: "1px solid rgba(26,23,20,0.1)",
                      borderRadius: "4px",
                      fontFamily: "Cormorant Garamond",
                    }}
                  />
                  <Bar dataKey="aye" fill="#2D3E2F" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="no" fill="#6B1C23" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="abstain" fill="#C8A13A" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-56 flex items-center justify-center text-ink-muted">
              <p className="font-body">暂无表决记录</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Party standings table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-parchment p-5"
      >
        <h3 className="font-display font-bold mb-4">政党概览</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10">
                <th className="text-left py-2 font-inscription text-xs uppercase tracking-wider text-ink-muted">
                  政党
                </th>
                <th className="text-center py-2 font-inscription text-xs uppercase tracking-wider text-ink-muted">
                  席位
                </th>
                <th className="text-center py-2 font-inscription text-xs uppercase tracking-wider text-ink-muted">
                  出席
                </th>
                <th className="text-center py-2 font-inscription text-xs uppercase tracking-wider text-ink-muted">
                  党鞭强度
                </th>
                <th className="text-center py-2 font-inscription text-xs uppercase tracking-wider text-ink-muted">
                  立场
                </th>
              </tr>
            </thead>
            <tbody>
              {session.parties.map((party) => (
                <tr key={party.id} className="border-b border-ink/5">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: party.color }}
                      />
                      <span className="font-body font-semibold">{party.name}</span>
                      {party.isGovernment && (
                        <span className="px-1.5 py-0.5 bg-gold/10 text-gold-dark text-[10px] font-inscription rounded-sm">
                          执政党
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="text-center font-mono">{party.seats}</td>
                  <td className="text-center font-mono">
                    {session.members.filter((m) => m.partyId === party.id && m.isPresent).length}
                  </td>
                  <td className="text-center font-mono">{party.whipStrength}</td>
                  <td className="text-center">
                    <span className="font-inscription text-xs uppercase">
                      {party.stance || "no"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
