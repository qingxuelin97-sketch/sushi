import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Printer } from "lucide-react";
import { useSessionStore } from "@/store/sessionStore";
import PageHeader from "@/components/PageHeader";
import { formatTimestamp, exportHansardAsMarkdown } from "@/utils/helpers";

export default function Hansard() {
  const session = useSessionStore((s) => s.session);
  const [filter, setFilter] = useState<string>("all");

  if (!session) {
    return (
      <div className="text-center py-20">
        <p className="font-body text-xl text-ink-muted">尚未创建议会会话</p>
      </div>
    );
  }

  const filteredEntries =
    filter === "all"
      ? session.hansard
      : session.hansard.filter((e) => e.type === filter);

  const handleExport = () => {
    const blob = new Blob([exportHansardAsMarkdown(session)], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hansard-${session.year}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <PageHeader title="汉萨德议事录" subtitle="Hansard" ornament="Official Record" />

      <div className="flex flex-wrap gap-3 mb-6">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={[
            "px-3 py-1.5 rounded-sm font-inscription text-xs tracking-wider uppercase transition-colors",
            filter === "all"
              ? "bg-commons-green text-parchment"
              : "bg-ink/5 text-ink/70 hover:bg-ink/10",
          ].join(" ")}
        >
          全部
        </button>
        {[
          { key: "speech", label: "发言" },
          { key: "vote", label: "表决" },
          { key: "event", label: "事件" },
          { key: "ruling", label: "裁定" },
        ].map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={[
              "px-3 py-1.5 rounded-sm font-inscription text-xs tracking-wider uppercase transition-colors",
              filter === f.key
                ? "bg-commons-green text-parchment"
                : "bg-ink/5 text-ink/70 hover:bg-ink/10",
            ].join(" ")}
          >
            {f.label}
          </button>
        ))}
        <div className="flex-1" />
        <button type="button" onClick={handleExport} className="btn-ghost text-xs">
          <Download className="w-3 h-3" />
          导出 Markdown
        </button>
        <button type="button" onClick={handlePrint} className="btn-ghost text-xs">
          <Printer className="w-3 h-3" />
          打印
        </button>
      </div>

      <div className="card-parchment p-6 lg:p-10 print:shadow-none print:border-none">
        {/* Parchment header */}
        <div className="text-center border-b-2 border-ink/20 pb-6 mb-8">
          <div className="font-inscription text-gold-dark tracking-[0.4em] uppercase text-sm mb-2">
            Official Report
          </div>
          <h2 className="font-display text-3xl font-bold mb-1">{session.name}</h2>
          <p className="font-body text-ink-muted">{session.year} 年度议事录摘要</p>
        </div>

        <div className="space-y-6">
          {filteredEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="border-l-2 border-gold/40 pl-4"
            >
              <div className="flex flex-wrap items-baseline gap-2 mb-1">
                <span className="font-mono text-xs text-ink-muted">
                  {formatTimestamp(entry.timestamp)}
                </span>
                <span
                  className={[
                    "text-[10px] font-inscription uppercase px-1.5 py-0.5 rounded-sm",
                    entry.type === "speech"
                      ? "bg-commons-green/10 text-commons-green"
                      : entry.type === "vote"
                      ? "bg-gold/10 text-gold-dark"
                      : entry.type === "event"
                      ? "bg-lords-red/10 text-lords-red"
                      : "bg-ink/10 text-ink-muted",
                  ].join(" ")}
                >
                  {entry.type}
                </span>
              </div>
              <div className="font-display font-bold text-sm mb-1">
                {entry.actorTitle} {entry.actorName}
              </div>
              <p className="font-body text-ink/90 leading-relaxed">{entry.content}</p>
            </motion.div>
          ))}
          {filteredEntries.length === 0 && (
            <div className="text-center py-12 text-ink-muted">
              <FileText className="w-10 h-10 mx-auto mb-2" />
              <p className="font-body">该分类下暂无记录</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-ink/20 flex items-center justify-between text-xs font-inscription text-ink-muted">
          <span>Parliament Simulator</span>
          <span>Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
}
