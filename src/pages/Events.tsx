import { motion } from "framer-motion";
import { Newspaper, Sparkles, CheckCircle, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import { useSessionStore } from "@/store/sessionStore";
import PageHeader from "@/components/PageHeader";

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
    session.publicOpinion > 60 ? "text-commons-green" : session.publicOpinion < 40 ? "text-lords-red" : "text-gold-dark";

  return (
    <div>
      <PageHeader title="事件与新闻" subtitle="Events & Press" ornament="Breaking News" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card-parchment p-5 text-center">
          <div className="font-inscription text-xs tracking-widest uppercase text-ink-muted mb-2">
            民众支持度
          </div>
          <div className={`font-display text-4xl font-bold ${opinionColor}`}>
            {session.publicOpinion}%
          </div>
          <div className="mt-2 h-2 bg-ink/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                session.publicOpinion > 60
                  ? "bg-commons-green"
                  : session.publicOpinion < 40
                  ? "bg-lords-red"
                  : "bg-gold"
              }`}
              style={{ width: `${session.publicOpinion}%` }}
            />
          </div>
        </div>

        <div className="card-parchment p-5 text-center">
          <div className="font-inscription text-xs tracking-widest uppercase text-ink-muted mb-2">
            待处理事件
          </div>
          <div className="font-display text-4xl font-bold text-ink">
            {session.events.filter((e) => !e.resolved).length}
          </div>
        </div>

        <div className="card-parchment p-5 text-center">
          <div className="font-inscription text-xs tracking-widest uppercase text-ink-muted mb-2">
            已发生事件
          </div>
          <div className="font-display text-4xl font-bold text-ink">
            {session.events.length}
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <button type="button" onClick={triggerEvent} className="btn-lords">
          <Sparkles className="w-4 h-4" />
          触发随机事件
        </button>
      </div>

      <div className="space-y-4">
        {session.events.length === 0 && (
          <div className="card-parchment p-8 text-center text-ink-muted">
            <Newspaper className="w-12 h-12 mx-auto mb-3" />
            <p className="font-body text-lg">暂无事件</p>
            <p className="font-body text-sm">点击上方按钮触发随机政治事件</p>
          </div>
        )}

        {[...session.events].reverse().map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card-parchment p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Newspaper className="w-4 h-4 text-gold-dark" />
                  <span className="font-inscription text-xs tracking-widest uppercase text-ink-muted">
                    {new Date(event.timestamp).toLocaleString("zh-CN")}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold mb-1">{event.title}</h3>
                <p className="font-body text-ink-muted">{event.description}</p>

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
                        ? "政党"
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
                  "flex items-center gap-1 px-3 py-1.5 rounded-sm font-inscription text-xs transition-colors",
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
          </motion.div>
        ))}
      </div>
    </div>
  );
}
