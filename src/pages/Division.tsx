import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, X, Minus, AlertCircle } from "lucide-react";
import { useSessionStore } from "@/store/sessionStore";
import PageHeader from "@/components/PageHeader";
import CountUp from "@/components/CountUp";
import type { Vote } from "@/types";

export default function Division() {
  const session = useSessionStore((s) => s.session);
  const activeMotionId = useSessionStore((s) => s.activeMotionId);
  const division = useSessionStore((s) => s.division);
  const {
    startDivision,
    advanceDivision,
    completeDivision,
    resetDivision,
    setPartyStance,
  } = useSessionStore();

  const [threshold, setThreshold] = useState<"simple-majority" | "two-thirds">("simple-majority");
  const [showBell, setShowBell] = useState(false);

  if (!session) {
    return (
      <div className="text-center py-20">
        <p className="font-body text-xl text-ink-muted">尚未创建议会会话</p>
      </div>
    );
  }

  const activeMotion = session.motions.find((m) => m.id === activeMotionId);

  const handleStart = () => {
    if (!activeMotion) return;
    setShowBell(true);
    startDivision(activeMotion.id);
    setTimeout(() => setShowBell(false), 2000);
  };

  const handleAdvance = () => {
    advanceDivision();
  };

  const handleComplete = () => {
    completeDivision(threshold);
  };

  return (
    <div>
      <PageHeader title="分组表决" subtitle="Division" ornament="Aye · No" />

      {/* Bell overlay */}
      <AnimatePresence>
        {showBell && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-commons-green text-parchment px-6 py-3 rounded-sm shadow-depth flex items-center gap-3"
          >
            <Bell className="w-5 h-5 animate-bell-ring" />
            <span className="font-inscription tracking-widest uppercase">Division Bell Ringing</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Control panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card-parchment p-5">
            <h3 className="font-display font-bold mb-3">议题与立场</h3>
            {activeMotion ? (
              <>
                <p className="font-display font-bold text-lg mb-1">{activeMotion.title}</p>
                <p className="font-body text-sm text-ink-muted mb-4">
                  {activeMotion.description}
                </p>

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

                <div className="mt-4 space-y-2">
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
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: party.color }}
                        />
                        {party.name}
                      </span>
                      <select
                        value={party.stance || "no"}
                        onChange={(e) =>
                          setPartyStance(party.id, e.target.value as Vote)
                        }
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
            <h3 className="font-display font-bold mb-3">议长控制台</h3>
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
                  <button type="button" onClick={handleAdvance} className="btn-commons w-full">
                    下一步：
                    {division.phase === "bell"
                      ? "开始投票"
                      : division.phase === "voting"
                      ? "计票"
                      : "宣读结果"}
                  </button>
                )}
                {division.phase === "result" && (
                  <button type="button" onClick={handleComplete} className="btn-brass w-full">
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
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="card-parchment p-5 text-center border-b-4 border-commons-green">
              <Check className="w-6 h-6 mx-auto text-commons-green mb-2" />
              <div className="font-inscription text-xs tracking-widest uppercase text-ink-muted mb-1">
                Aye
              </div>
              <div className="font-display text-4xl font-bold text-commons-green">
                {activeMotion?.vote ? (
                  <CountUp target={activeMotion.vote.aye} />
                ) : division.phase === "tally" || division.phase === "result" ? (
                  Object.values(division.progressByParty).reduce((s, p) => s + p.aye, 0)
                ) : (
                  "—"
                )}
              </div>
            </div>
            <div className="card-parchment p-5 text-center border-b-4 border-lords-red">
              <X className="w-6 h-6 mx-auto text-lords-red mb-2" />
              <div className="font-inscription text-xs tracking-widest uppercase text-ink-muted mb-1">
                No
              </div>
              <div className="font-display text-4xl font-bold text-lords-red">
                {activeMotion?.vote ? (
                  <CountUp target={activeMotion.vote.no} />
                ) : division.phase === "tally" || division.phase === "result" ? (
                  Object.values(division.progressByParty).reduce((s, p) => s + p.no, 0)
                ) : (
                  "—"
                )}
              </div>
            </div>
            <div className="card-parchment p-5 text-center border-b-4 border-gold">
              <Minus className="w-6 h-6 mx-auto text-gold mb-2" />
              <div className="font-inscription text-xs tracking-widest uppercase text-ink-muted mb-1">
                Abstain
              </div>
              <div className="font-display text-4xl font-bold text-gold">
                {activeMotion?.vote ? (
                  <CountUp target={activeMotion.vote.abstain} />
                ) : division.phase === "tally" || division.phase === "result" ? (
                  Object.values(division.progressByParty).reduce((s, p) => s + p.abstain, 0)
                ) : (
                  "—"
                )}
              </div>
            </div>
          </div>

          {/* Phase indicator */}
          <div className="card-parchment p-5">
            <div className="flex items-center justify-between mb-4">
              {["idle", "bell", "voting", "tally", "result"].map((phase, index) => (
                <div key={phase} className="flex items-center flex-1">
                  <div
                    className={[
                      "w-8 h-8 rounded-full flex items-center justify-center font-inscription text-xs",
                      division.phase === phase ||
                      ["bell", "voting", "tally", "result"].indexOf(division.phase) >= index
                        ? "bg-commons-green text-parchment"
                        : "bg-ink/10 text-ink-muted",
                    ].join(" ")}
                  >
                    {index + 1}
                  </div>
                  {index < 4 && (
                    <div
                      className={[
                        "flex-1 h-1 mx-2",
                        ["bell", "voting", "tally", "result"].indexOf(division.phase) > index
                          ? "bg-commons-green"
                          : "bg-ink/10",
                      ].join(" ")}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center font-inscription text-sm tracking-widest uppercase text-commons-green">
              {division.phase === "idle" && "等待议长发起表决"}
              {division.phase === "bell" && "分铃召集议员"}
              {division.phase === "voting" && "议员进入 Aye / No 走廊"}
              {division.phase === "tally" && "计票员清点人数"}
              {division.phase === "result" && "宣读表决结果"}
            </div>
          </div>

          {/* Result card */}
          {activeMotion?.vote && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-parchment p-6 text-center"
            >
              <div
                className={[
                  "inline-flex items-center gap-2 px-4 py-2 rounded-sm font-inscription text-lg tracking-widest uppercase mb-3",
                  activeMotion.vote.passed
                    ? "bg-commons-green text-parchment"
                    : "bg-lords-red text-parchment",
                ].join(" ")}
              >
                {activeMotion.vote.passed ? (
                  <>
                    <Check className="w-5 h-5" /> 通过
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5" /> 否决
                  </>
                )}
              </div>
              <p className="font-body text-ink-muted">
                {activeMotion.title} 最终以 Aye {activeMotion.vote.aye} 票、No{" "}
                {activeMotion.vote.no} 票、弃权 {activeMotion.vote.abstain} 票的结果
                {activeMotion.vote.passed ? "获得通过" : "被否决"}。
              </p>
            </motion.div>
          )}

          {/* Party breakdown */}
          {division.phase !== "idle" && (
            <div className="card-parchment p-5">
              <h3 className="font-display font-bold mb-3">政党投票分布</h3>
              <div className="space-y-3">
                {session.parties.map((party) => {
                  const counts = division.progressByParty[party.id] || { aye: 0, no: 0, abstain: 0 };
                  const total = counts.aye + counts.no + counts.abstain || 1;
                  return (
                    <div key={party.id}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-body">{party.name}</span>
                        <span className="font-mono text-xs">
                          Aye {counts.aye} / No {counts.no} / Abstain {counts.abstain}
                        </span>
                      </div>
                      <div className="w-full h-3 bg-ink/10 rounded-full overflow-hidden flex">
                        <div
                          className="bg-commons-green h-full"
                          style={{ width: `${(counts.aye / total) * 100}%` }}
                        />
                        <div
                          className="bg-lords-red h-full"
                          style={{ width: `${(counts.no / total) * 100}%` }}
                        />
                        <div
                          className="bg-gold h-full"
                          style={{ width: `${(counts.abstain / total) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
