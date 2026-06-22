import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Crown, Users, Scale, FileText } from "lucide-react";
import { useSessionStore } from "@/store/sessionStore";
import PageHeader from "@/components/PageHeader";

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

  return (
    <div>
      <PageHeader title="统计看板" subtitle="Analytics" ornament="Data & Trends" />

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card-parchment p-4">
          <Users className="w-5 h-5 text-commons-green mb-2" />
          <div className="font-mono text-2xl font-bold">{session.members.length}</div>
          <div className="font-inscription text-[10px] text-ink-muted uppercase tracking-wider">
            议员总数
          </div>
        </div>
        <div className="card-parchment p-4">
          <Crown className="w-5 h-5 text-gold mb-2" />
          <div className="font-mono text-2xl font-bold">{session.parties.length}</div>
          <div className="font-inscription text-[10px] text-ink-muted uppercase tracking-wider">
            政党数量
          </div>
        </div>
        <div className="card-parchment p-4">
          <Scale className="w-5 h-5 text-lords-red mb-2" />
          <div className="font-mono text-2xl font-bold">
            {totalVotes > 0 ? Math.round((passedCount / totalVotes) * 100) : 0}%
          </div>
          <div className="font-inscription text-[10px] text-ink-muted uppercase tracking-wider">
            议案通过率
          </div>
        </div>
        <div className="card-parchment p-4">
          <FileText className="w-5 h-5 text-ink-muted mb-2" />
          <div className="font-mono text-2xl font-bold">{session.hansard.length}</div>
          <div className="font-inscription text-[10px] text-ink-muted uppercase tracking-wider">
            议事录条目
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Seat distribution */}
        <div className="card-parchment p-5">
          <h3 className="font-display font-bold mb-4">席位分布</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={seatData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
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
        </div>

        {/* Vote history */}
        <div className="card-parchment p-5">
          <h3 className="font-display font-bold mb-4">表决历史</h3>
          {voteData.length > 0 ? (
            <div className="h-64">
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
            <div className="h-64 flex items-center justify-center text-ink-muted">
              <p className="font-body">暂无表决记录</p>
            </div>
          )}
        </div>
      </div>

      {/* Party standings table */}
      <div className="card-parchment p-5 mt-6">
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
      </div>
    </div>
  );
}
