import { motion, AnimatePresence } from "framer-motion";
import {
  Newspaper,
  Sparkles,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
} from "lucide-react";
import { useSessionStore } from "@/store/sessionStore";
import PageHeader from "@/components/PageHeader";
import { formatShortTime } from "@/utils/helpers";

export default function Events() {
  const session = useSessionStore((s) => s.session);
  const { triggerEvent, resolveEvent } = useSessionStore();

  if (!session) {
    return (
      <div className="text-center py-20">
        <p className="font-body text-xl text-ink-muted">尚未创建议会会话</p>
      </div>
    );
  }

  const opinionColor =
    session.publicOpinion > 60
      ? "text-commons-green"
      : session.publicOpinion < 40
      ? "text-lords-red"
      : "text-gold-dark";

  const opinionBg =
    session.publicOpinion > 60
      ? "bg-commons-green"
      : session.publicOpinion < 40
      ? "bg-lords-red"
      : "bg-gold";

  const recentEvents = [...session.events].reverse().slice(0, 10);
  const unresolved = session.events.filter((e) => !e.resolved);

  return (
    <div>
      <PageHeader title="事件与新闻" subtitle="Events & Press" ornament="Breaking News" />

      {/* Top stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <div className="card-parchment p-5 text-center">
          <div className="font-inscription text-xs tracking-widest uppercase text-ink-muted mb-2">
            民众支持度
          </div>
          <div className={`font-display text-4xl font-bold ${opinionColor}`}>
            {session.publicOpinion}%
          </div>
          <div className="mt-2 h-2 bg-ink/10 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${session.publicOpinion}%` }}
              transition={{ type: "spring", stiffness: 60 }}
              className={`h-full rounded-full ${opinionBg}`}
            />
          </div>
        </div>

        <div className="card-parchment p-5 text-center">
          <div className="font-inscription text-xs tracking-widest uppercase text-ink-muted mb-2">
            待处理事件
          </div>
          <div className="font-display text-4xl font-bold text-lords-red">
            {unresolved.length}
          </div>
          {unresolved.length > 0 && (
            <div className="font-inscription text-[10px] text-lords-red uppercase mt-1 animate-pulse">
              需要关注
            </div>
          )}
        </div>

        <div className="card-parchment p-5 text-center">
          <div className="font-inscription text-xs tracking-widest uppercase text-ink-muted mb-2">
            已发生事件
          </div>
          <div className="font-display text-4xl font-bold text-ink">
            {session.events.length}
          </div>
        </div>

        <div className="card-parchment p-5 text-center flex flex-col items-center justify-center">
          <button type="button" onClick={triggerEvent} className="btn-lords w-full">
            <Sparkles className="w-4 h-4" />
            触发随机事件
          </button>
          <p className="font-inscription text-[10px] text-ink-muted mt-2 uppercase">
            模拟突发政治事件
          </p>
        </div>
      </div>

      {/* Party impact summary */}
      <div className="card-parchment p-5 mb-6">
        <h3 className="font-display font-bold mb-4">政党受影响概览</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {session.parties.map((party) => {
            const impacts = session.events.flatMap((e) =>
              e.impact.filter((i) => i.targetType === "party" && i.targetId === party.id)
            );
            const totalDelta = impacts.reduce((s, i) => s + i.delta, 0);
            return (
              <div
                key={party.id}
                className="text-center p-3 rounded-sm"
                style={{ backgroundColor: party.color + "10" }}
              >
                <div
                  className="w-3 h-3 rounded-full mx-auto mb-1"
                  style={{ backgroundColor: party.color }}
                />
                <div className="font-inscription text-[10px] uppercase tracking-wider text-ink-muted">
                  {party.abbreviation}
                </div>
                <div
                  className={[
                    "font-mono text-lg font-bold",
                    totalDelta > 0
                      ? "text-commons-green"
                      : totalDelta < 0
                      ? "text-lords-red"
                      : "text-ink-muted",
                  ].join(" ")}
                >
                  {totalDelta > 0 ? "+" : ""}
                  {totalDelta}
                </div>
                <div className="font-inscription text-[9px] text-ink-muted uppercase">
                  党鞭 {party.whipStrength}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event timeline */}
      <div className="card-parchment p-5">
        <h3 className="font-display font-bold mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          事件时间线
        </h3>
        {session.events.length === 0 ? (
          <div className="text-center py-12 text-ink-muted">
            <Newspaper className="w-12 h-12 mx-auto mb-3" />
            <p className="font-body text-lg">暂无事件</p>
            <p className="font-body text-sm">点击上方按钮触发随机政治事件</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gold/30" />

            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {recentEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.03 }}
                    className="relative pl-12"
                  >
                    {/* Timeline dot */}
                    <div
                      className={[
                        "absolute left-2.5 top-3 w-3 h-3 rounded-full border-2 border-parchment z-10",
                        event.resolved ? "bg-commons-green" : "bg-lords-red animate-pulse",
                      ].join(" ")}
                    />

                    <div
                      className={[
                        "p-4 rounded-sm border transition-colors",
                        event.resolved
                          ? "bg-ink/5 border-ink/10"
                          : "bg-lords-red/5 border-lords-red/20",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Zap className="w-3 h-3 text-gold-dark" />
                            <span className="font-inscription text-xs tracking-widest uppercase text-ink-muted">
                              {formatShortTime(event.timestamp)}
                            </span>
                            {!event.resolved && (
                              <span className="font-inscription text-[9px] px-1.5 py-0.5 bg-lords-red text-parchment rounded-sm uppercase animate-pulse">
                                未处理
                              </span>
                            )}
                          </div>
                          <h4 className="font-display text-lg font-bold mb-1">{event.title}</h4>
                          <p className="font-body text-sm text-ink-muted">{event.description}</p>

                          <div className="flex flex-wrap gap-2 mt-3">
                            {event.impact.map((impact, i) => (
                              <span
                                key={i}
                                className={[
                                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-inscription",
                                  impact.delta > 0
                                    ? "bg-commons-green/10 text-commons-green"
                                    : "bg-lords-red/10 text-lords-red",
                                ].join(" ")}
                              >
                                {impact.delta > 0 ? (
                                  <TrendingUp className="w-3 h-3" />
                                ) : (
                                  <TrendingDown className="w-3 h-3" />
                                )}
                                {impact.targetType === "opinion"
                                  ? "民意"
                                  : impact.targetType === "party"
                                  ? session.parties.find((p) => p.id === impact.targetId)?.abbreviation || "政党"
                                  : "议员"}
                                {impact.delta > 0 ? "+" : ""}
                                {impact.delta}
                              </span>
                            ))}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => resolveEvent(event.id)}
                          disabled={event.resolved}
                          className={[
                            "flex items-center gap-1 px-3 py-1.5 rounded-sm font-inscription text-xs transition-colors flex-shrink-0",
                            event.resolved
                              ? "bg-commons-green text-parchment"
                              : "bg-ink/5 text-ink-muted hover:bg-ink/10",
                          ].join(" ")}
                        >
                          {event.resolved ? (
                            <>
                              <CheckCircle className="w-3 h-3" /> 已处理
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3" /> 处理
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
