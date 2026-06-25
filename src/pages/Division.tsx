import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, X, Minus, AlertCircle, Crown, Scale, Users } from "lucide-react";
import { useSessionStore } from "@/store/sessionStore";
import PageHeader from "@/components/PageHeader";
import CountUp from "@/components/CountUp";
import type { Vote } from "@/types";

const phases = [
  { id: "idle", label: "等待议长发起表决", number: 1 },
  { id: "bell", label: "分铃召集议员", number: 2 },
  { id: "voting", label: "议员进入 Aye / No 走廊", number: 3 },
  { id: "tally", label: "计票员清点人数", number: 4 },
  { id: "result", label: "宣读表决结果", number: 5 },
] as const;

export default function Division() {
  const session = useSessionStore((s) => s.session);
  const activeMotionId = useSessionStore((s) => s.activeMotionId);
  const division = useSessionStore((s) => s.division);
  const { startDivision, advanceDivision, completeDivision, resetDivision, setPartyStance } =
    useSessionStore();

  const [threshold, setThreshold] = useState<"simple-majority" | "two-thirds">("simple-majority");
  const [showBell, setShowBell] = useState(false);
  const [rollCallIdx, setRollCallIdx] = useState(0);

  const activeMotion = session?.motions.find((m) => m.id === activeMotionId);

  // Auto-advance roll call during tally phase
  useEffect(() => {
    if (division.phase !== "tally") {
      setRollCallIdx(0);
      return;
    }
    if (rollCallIdx >= (session?.parties.length || 0)) return;
    const timer = setTimeout(() => setRollCallIdx((i) => i + 1), 800);
    return () => clearTimeout(timer);
  }, [division.phase, rollCallIdx, session?.parties.length]);

  if (!session) {
    return (
      <div className="text-center py-20">
        <p className="font-body text-xl text-ink-muted">尚未创建议会会话</p>
      </div>
    );
  }

  const handleStart = () => {
    if (!activeMotion) return;
    setShowBell(true);
    startDivision(activeMotion.id);
    setTimeout(() => setShowBell(false), 2500);
  };

  const ayeCount = activeMotion?.vote
    ? activeMotion.vote.aye
    : division.phase === "tally" || division.phase === "result"
    ? Object.values(division.progressByParty).reduce((s, p) => s + p.aye, 0)
    : 0;

  const noCount = activeMotion?.vote
    ? activeMotion.vote.no
    : division.phase === "tally" || division.phase === "result"
    ? Object.values(division.progressByParty).reduce((s, p) => s + p.no, 0)
    : 0;

  const abstainCount = activeMotion?.vote
    ? activeMotion.vote.abstain
    : division.phase === "tally" || division.phase === "result"
    ? Object.values(division.progressByParty).reduce((s, p) => s + p.abstain, 0)
    : 0;

  const totalVotes = ayeCount + noCount + abstainCount;

  return (
    <div>
      <PageHeader title="分组表决" subtitle="Division" ornament="Aye · No" />

      {/* Bell overlay */}
      <AnimatePresence>
        {showBell && (
          <motion.div
            initial={{ opacity: 0, y: -60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -60, scale: 0.9 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-commons-green text-parchment px-8 py-4 rounded-sm shadow-depth border-2 border-gold flex items-center gap-4"
          >
            <Bell className="w-6 h-6 animate-bell-ring" />
            <span className="font-inscription tracking-[0.2em] uppercase text-sm">
              Division Bell Ringing
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Control panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card-parchment p-5">
            <h3 className="font-display font-bold mb-3 flex items-center gap-2">
              <Scale className="w-4 h-4 text-gold-dark" />
              议题与立场
            </h3>
            {activeMotion ? (
              <>
                <p className="font-display font-bold text-lg mb-1">{activeMotion.title}</p>
                <p className="font-body text-sm text-ink-muted mb-5">{activeMotion.description}</p>

                <div className="space-y-3">
                  <label className="font-inscription text-xs uppercase tracking-wider text-ink-muted">
                    通过门槛
                  </label>
                  <select
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value as typeof threshold)}
                    className="w-full bg-parchment-light border border-ink/20 rounded-sm px-3 py-2 text-sm"
                    disabled={division.isActive}
                  >
                    <option value="simple-majority">简单多数</option>
                    <option value="two-thirds">三分之二多数</option>
                  </select>
                </div>

                <div className="mt-5 space-y-2">
                  <label className="font-inscription text-xs uppercase tracking-wider text-ink-muted">
                    各党立场
                  </label>
                  {session.parties.map((party) => (
                    <div
                      key={party.id}
                      className="flex items-center justify-between p-2 bg-ink/5 rounded-sm"
                    >
                      <span className="font-body text-sm flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shadow-sm"
                          style={{ backgroundColor: party.color }}
                        />
                        {party.name}
                        <span className="font-mono text-[10px] text-ink-muted">({party.seats})</span>
                      </span>
                      <select
                        value={party.stance || "no"}
                        onChange={(e) => setPartyStance(party.id, e.target.value as Vote)}
                        disabled={division.isActive}
                        className="bg-parchment-light border border-ink/20 rounded-sm px-2 py-1 text-xs"
                      >
                        <option value="aye">Aye</option>
                        <option value="no">No</option>
                        <option value="abstain">Abstain</option>
                      </select>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 text-ink-muted">
                <AlertCircle className="w-5 h-5" />
                <span className="font-body">请先在议程页面选择议题</span>
              </div>
            )}
          </div>

          <div className="card-parchment p-5">
            <h3 className="font-display font-bold mb-3 flex items-center gap-2">
              <Crown className="w-4 h-4 text-gold-dark" />
              议长控制台
            </h3>
            {!division.isActive ? (
              <button
                type="button"
                onClick={handleStart}
                disabled={!activeMotion}
                className="btn-brass w-full"
              >
                <Bell className="w-4 h-4" />
                发起分组表决
              </button>
            ) : (
              <div className="space-y-2">
                {division.phase !== "result" && (
                  <button type="button" onClick={advanceDivision} className="btn-commons w-full">
                    下一步：
                    {division.phase === "bell"
                      ? "开始投票"
                      : division.phase === "voting"
                      ? "计票"
                      : "宣读结果"}
                  </button>
                )}
                {division.phase === "result" && (
                  <button
                    type="button"
                    onClick={() => completeDivision(threshold)}
                    className="btn-brass w-full"
                  >
                    确认结果并归档
                  </button>
                )}
                <button type="button" onClick={resetDivision} className="btn-ghost w-full">
                  取消表决
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Division visualization */}
        <div className="lg:col-span-2 space-y-5">
          {/* Vote counters */}
          <div className="grid grid-cols-3 gap-4">
            <motion.div
              whileHover={{ y: -4 }}
              className="card-parchment p-5 text-center border-b-4 border-commons-green relative overflow-hidden"
            >
              <Check className="w-6 h-6 mx-auto text-commons-green mb-2" />
              <div className="font-inscription text-xs tracking-widest uppercase text-ink-muted mb-1">
                Aye
              </div>
              <div className="font-display text-4xl font-bold text-commons-green">
                {division.phase === "idle" && !activeMotion?.vote ? (
                  "—"
                ) : (
                  <CountUp target={ayeCount} />
                )}
              </div>
              {totalVotes > 0 && (
                <div className="font-mono text-[10px] text-ink-muted mt-1">
                  {Math.round((ayeCount / totalVotes) * 100)}%
                </div>
              )}
            </motion.div>
            <motion.div
              whileHover={{ y: -4 }}
              className="card-parchment p-5 text-center border-b-4 border-lords-red relative overflow-hidden"
            >
              <X className="w-6 h-6 mx-auto text-lords-red mb-2" />
              <div className="font-inscription text-xs tracking-widest uppercase text-ink-muted mb-1">
                No
              </div>
              <div className="font-display text-4xl font-bold text-lords-red">
                {division.phase === "idle" && !activeMotion?.vote ? (
                  "—"
                ) : (
                  <CountUp target={noCount} />
                )}
              </div>
              {totalVotes > 0 && (
                <div className="font-mono text-[10px] text-ink-muted mt-1">
                  {Math.round((noCount / totalVotes) * 100)}%
                </div>
              )}
            </motion.div>
            <motion.div
              whileHover={{ y: -4 }}
              className="card-parchment p-5 text-center border-b-4 border-gold relative overflow-hidden"
            >
              <Minus className="w-6 h-6 mx-auto text-gold mb-2" />
              <div className="font-inscription text-xs tracking-widest uppercase text-ink-muted mb-1">
                Abstain
              </div>
              <div className="font-display text-4xl font-bold text-gold">
                {division.phase === "idle" && !activeMotion?.vote ? (
                  "—"
                ) : (
                  <CountUp target={abstainCount} />
                )}
              </div>
              {totalVotes > 0 && (
                <div className="font-mono text-[10px] text-ink-muted mt-1">
                  {Math.round((abstainCount / totalVotes) * 100)}%
                </div>
              )}
            </motion.div>
          </div>

          {/* Phase indicator */}
          <div className="card-parchment p-5">
            <div className="flex items-center justify-between mb-5">
              {phases.map((phase, index) => {
                const active = phase.id === division.phase;
                const passed = phases.findIndex((p) => p.id === division.phase) >= index;
                return (
                  <div key={phase.id} className="flex items-center flex-1">
                    <motion.div
                      animate={
                        active
                          ? { scale: [1, 1.15, 1], boxShadow: "0 0 0 4px rgba(200,161,58,0.25)" }
                          : {}
                      }
                      transition={{ duration: 1, repeat: active ? Infinity : 0 }}
                      className={[
                        "w-9 h-9 rounded-full flex items-center justify-center font-inscription text-xs transition-colors duration-300",
                        active
                          ? "bg-gold text-ink"
                          : passed
                          ? "bg-commons-green text-parchment"
                          : "bg-ink/10 text-ink-muted",
                      ].join(" ")}
                    >
                      {phase.number}
                    </motion.div>
                    {index < phases.length - 1 && (
                      <div
                        className={[
                          "flex-1 h-1 mx-2 rounded-full transition-colors duration-300",
                          passed && index < phases.findIndex((p) => p.id === division.phase)
                            ? "bg-commons-green"
                            : "bg-ink/10",
                        ].join(" ")}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="text-center font-inscription text-sm tracking-[0.15em] uppercase text-commons-green">
              {phases.find((p) => p.id === division.phase)?.label}
            </div>
          </div>

          {/* Aye/No lobby visualization during voting */}
          <AnimatePresence>
            {(division.phase === "voting" || division.phase === "tally") && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="card-parchment p-5"
              >
                <h3 className="font-display font-bold mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  投票走廊
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Aye lobby */}
                  <div className="bg-commons-green/5 border border-commons-green/20 rounded-sm p-4">
                    <div className="font-inscription text-xs uppercase tracking-widest text-commons-green mb-2 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Aye Lobby
                    </div>
                    <div className="space-y-1">
                      {session.parties.map((party) => {
                        const counts = division.progressByParty[party.id] || { aye: 0, no: 0, abstain: 0 };
                        return (
                          <div key={party.id} className="flex items-center gap-2 text-xs">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: party.color }} />
                            <span className="font-body flex-1">{party.abbreviation}</span>
                            <span className="font-mono font-bold text-commons-green">{counts.aye}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {/* No lobby */}
                  <div className="bg-lords-red/5 border border-lords-red/20 rounded-sm p-4">
                    <div className="font-inscription text-xs uppercase tracking-widest text-lords-red mb-2 flex items-center gap-1">
                      <X className="w-3 h-3" /> No Lobby
                    </div>
                    <div className="space-y-1">
                      {session.parties.map((party) => {
                        const counts = division.progressByParty[party.id] || { aye: 0, no: 0, abstain: 0 };
                        return (
                          <div key={party.id} className="flex items-center gap-2 text-xs">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: party.color }} />
                            <span className="font-body flex-1">{party.abbreviation}</span>
                            <span className="font-mono font-bold text-lords-red">{counts.no}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Roll call animation during tally */}
          <AnimatePresence>
            {division.phase === "tally" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="card-parchment p-5"
              >
                <h3 className="font-display font-bold mb-4">逐党唱票</h3>
                <div className="space-y-2">
                  {session.parties.map((party, idx) => {
                    const counts = division.progressByParty[party.id] || { aye: 0, no: 0, abstain: 0 };
                    const revealed = idx < rollCallIdx;
                    return (
                      <motion.div
                        key={party.id}
                        initial={{ opacity: 0.3 }}
                        animate={{ opacity: revealed ? 1 : 0.3 }}
                        className="flex items-center gap-3 p-2 rounded-sm"
                        style={{ backgroundColor: revealed ? party.color + "10" : "transparent" }}
                      >
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: party.color }} />
                        <span className="font-body text-sm flex-1">{party.name}</span>
                        {revealed ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-3 font-mono text-sm"
                          >
                            <span className="text-commons-green">Aye {counts.aye}</span>
                            <span className="text-lords-red">No {counts.no}</span>
                            <span className="text-gold">Ab {counts.abstain}</span>
                          </motion.div>
                        ) : (
                          <span className="font-inscription text-xs text-ink-muted">等待唱票...</span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result card */}
          <AnimatePresence>
            {activeMotion?.vote && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="card-parchment p-6 text-center relative overflow-hidden"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
                  className={[
                    "inline-flex items-center gap-2 px-5 py-2.5 rounded-sm font-inscription text-lg tracking-[0.15em] uppercase mb-3",
                    activeMotion.vote.passed
                      ? "bg-commons-green text-parchment"
                      : "bg-lords-red text-parchment",
                  ].join(" ")}
                >
                  {activeMotion.vote.passed ? (
                    <>
                      <Check className="w-5 h-5" /> 议案通过
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5" /> 议案否决
                    </>
                  )}
                </motion.div>
                <p className="font-body text-ink-muted">
                  {activeMotion.title} 最终以 Aye {activeMotion.vote.aye} 票、No{" "}
                  {activeMotion.vote.no} 票、弃权 {activeMotion.vote.abstain} 票的结果
                  {activeMotion.vote.passed ? "获得通过" : "被否决"}。
                </p>
                <motion.div
                  initial={{ opacity: 0, scale: 2, rotate: -10 }}
                  animate={{ opacity: 0.06, scale: 1, rotate: -6 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                >
                  <Scale className="w-48 h-48 text-ink" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Party breakdown */}
          {division.phase !== "idle" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-parchment p-5"
            >
              <h3 className="font-display font-bold mb-4">政党投票分布</h3>
              <div className="space-y-4">
                {session.parties.map((party) => {
                  const counts = division.progressByParty[party.id] || { aye: 0, no: 0, abstain: 0 };
                  const total = counts.aye + counts.no + counts.abstain || 1;
                  return (
                    <div key={party.id}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-body flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: party.color }}
                          />
                          {party.name}
                        </span>
                        <span className="font-mono text-xs">
                          Aye {counts.aye} / No {counts.no} / Abstain {counts.abstain}
                        </span>
                      </div>
                      <div className="w-full h-3 bg-ink/10 rounded-full overflow-hidden flex">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(counts.aye / total) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.1 }}
                          className="bg-commons-green h-full"
                        />
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(counts.no / total) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className="bg-lords-red h-full"
                        />
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(counts.abstain / total) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                          className="bg-gold h-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
