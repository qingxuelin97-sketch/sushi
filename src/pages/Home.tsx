import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Crown, Scroll, Landmark, ArrowRight, RotateCcw } from "lucide-react";
import { useSessionStore } from "@/store/sessionStore";
import Crest from "@/components/Crest";
import OrnateDivider from "@/components/OrnateDivider";

export default function Home() {
  const navigate = useNavigate();
  const { session, createSession, resetSession } = useSessionStore();
  const [name, setName] = useState("联合王国第 59 届议会模拟");
  const [year, setYear] = useState(new Date().getFullYear());
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = () => {
    setIsCreating(true);
    setTimeout(() => {
      createSession(name, year);
      navigate("/chamber");
    }, 1200);
  };

  const handleContinue = () => {
    navigate("/chamber");
  };

  const handleReset = () => {
    if (confirm("确定要重置当前会话吗？所有数据将被清除。")) {
      resetSession();
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl"
      >
        <div className="card-parchment p-8 lg:p-12 relative">
          {/* Corner ornaments */}
          <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-gold-dark/40" />
          <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-gold-dark/40" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-gold-dark/40" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-gold-dark/40" />

          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <Crest className="w-32 h-auto mx-auto mb-6 drop-shadow-xl" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="font-display text-4xl lg:text-5xl font-bold text-ink mb-2"
            >
              议会模拟器
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-inscription text-gold-dark tracking-[0.3em] uppercase text-sm"
            >
              Parliament Simulator
            </motion.p>

            <OrnateDivider text="Est. 2026" />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="font-body text-lg text-ink-muted max-w-md mb-8"
            >
              创建你的威斯敏斯特式议会，管理政党与议员，主持辩论，发起分组表决，并生成汉萨德议事录。
            </motion.p>

            {session ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full space-y-4"
              >
                <div className="bg-commons-green/5 border border-commons-green/20 rounded-sm p-4 text-left">
                  <div className="flex items-center gap-2 text-commons-green font-inscription text-xs tracking-widest uppercase mb-1">
                    <Landmark className="w-4 h-4" />
                    当前会话
                  </div>
                  <p className="font-display text-xl font-bold">{session.name}</p>
                  <p className="font-body text-ink-muted text-sm">
                    {session.year} · {session.members.length} 名议员 ·{" "}
                    {session.parties.length} 个政党
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button type="button" onClick={handleContinue} className="btn-brass">
                    继续会议
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={handleReset} className="btn-ghost">
                    <RotateCcw className="w-4 h-4" />
                    重置会话
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="w-full space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  <div>
                    <label className="block font-inscription text-xs tracking-widest uppercase text-ink-muted mb-2">
                      <Crown className="w-3 h-3 inline mr-1" />
                      议会名称
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-parchment-light border border-ink/20 rounded-sm px-4 py-2.5 font-body text-ink focus:outline-none focus:border-gold-dark focus:ring-1 focus:ring-gold-dark"
                      placeholder="输入议会名称"
                    />
                  </div>
                  <div>
                    <label className="block font-inscription text-xs tracking-widest uppercase text-ink-muted mb-2">
                      <Scroll className="w-3 h-3 inline mr-1" />
                      会期年份
                    </label>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(parseInt(e.target.value) || 2026)}
                      className="w-full bg-parchment-light border border-ink/20 rounded-sm px-4 py-2.5 font-body text-ink focus:outline-none focus:border-gold-dark focus:ring-1 focus:ring-gold-dark"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="btn-brass w-full"
                >
                  {isCreating ? (
                    <span className="animate-pulse">正在召开议会...</span>
                  ) : (
                    <>
                      召开议会
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="font-body text-sm text-ink-muted">
                  系统将自动生成议长、政党和 100 名议员。
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
