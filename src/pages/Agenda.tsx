import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Mic,
  MessageSquare,
  FilePlus,
  Gavel,
  AlertTriangle,
  Play,
  FastForward,
  ChevronRight,
  Clock,
  Zap,
  Scroll,
} from "lucide-react";
import { useSessionStore } from "@/store/sessionStore";
import type { DebatePhase } from "@/store/sessionStore";
import PageHeader from "@/components/PageHeader";
import MemberAvatar from "@/components/MemberAvatar";
import { generateSpeechContent, generateRuling, formatShortTime } from "@/utils/helpers";
import type { Motion } from "@/types";

const PHASE_LABELS: Record<DebatePhase, string> = {
  opening: "开场陈述",
  arguments: "主辩论",
  rebuttal: "反驳阶段",
  closing: "总结陈词",
  vote: "进入表决",
};

const PHASE_ORDER: DebatePhase[] = ["opening", "arguments", "rebuttal", "closing", "vote"];

export default function Agenda() {
  const navigate = useNavigate();
  const session = useSessionStore((s) => s.session);
  const activeMotionId = useSessionStore((s) => s.activeMotionId);
  const speechQueue = useSessionStore((s) => s.speechQueue);
  const debatePhase = useSessionStore((s) => s.debatePhase);
  const {
    setActiveMotion,
    updateMotion,
    addSpeech,
    addToQueue,
    removeFromQueue,
    addRuling,
    addAmendment,
    setDebatePhase,
    advanceDebatePhase,
    autoDebate,
    callDivision,
  } = useSessionStore();

  const [newMotionTitle, setNewMotionTitle] = useState("");
  const [newMotionDesc, setNewMotionDesc] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [speechContent, setSpeechContent] = useState("");
  const [amendmentText, setAmendmentText] = useState("");
  const [showMotionForm, setShowMotionForm] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [latestSpeechId, setLatestSpeechId] = useState<string | null>(null);
  const speechListRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest speech
  useEffect(() => {
    if (speechListRef.current) {
      speechListRef.current.scrollTop = speechListRef.current.scrollHeight;
    }
  }, [session?.motions]);

  // Auto-debate mode
  useEffect(() => {
    if (!autoMode || !activeMotionId) return;
    const interval = setInterval(() => {
      autoDebate();
    }, 2500);
    return () => clearInterval(interval);
  }, [autoMode, activeMotionId, autoDebate]);

  if (!session) {
    return (
      <div className="text-center py-20">
        <p className="font-body text-xl text-ink-muted">尚未创建议会会话</p>
      </div>
    );
  }

  const activeMotion = session.motions.find((m) => m.id === activeMotionId);

  const handleAddMotion = () => {
    if (!newMotionTitle.trim()) return;
    const motion: Motion = {
      id: `motion-${Date.now()}`,
      title: newMotionTitle,
      type: "motion",
      description: newMotionDesc,
      proposerId: session.members[0]?.id || "",
      status: "draft",
      speeches: [],
      amendments: [],
      createdAt: Date.now(),
    };
    useSessionStore.setState((state) => ({
      session: state.session
        ? {
            ...state.session,
            motions: [...state.session.motions, motion],
            updatedAt: Date.now(),
          }
        : null,
      activeMotionId: motion.id,
    }));
    setNewMotionTitle("");
    setNewMotionDesc("");
    setShowMotionForm(false);
  };

  const handleAddSpeech = () => {
    if (!activeMotion || !selectedMemberId) return;
    const member = session.members.find((m) => m.id === selectedMemberId);
    if (!member) return;
    const party = session.parties.find((p) => p.id === member.partyId);
    const content = speechContent || generateSpeechContent(member, party || session.parties[0]);
    addSpeech(activeMotion.id, selectedMemberId, content);
    removeFromQueue(selectedMemberId);
    setSpeechContent("");
    // Track latest speech for highlight
    const updated = useSessionStore.getState().session;
    const m = updated?.motions.find((mm) => mm.id === activeMotion.id);
    const last = m?.speeches[m.speeches.length - 1];
    if (last) setLatestSpeechId(last.id);
  };

  const handleAutoSpeech = () => {
    if (!activeMotion) return;
    const member = session.members.find((m) => m.id === selectedMemberId);
    if (!member) return;
    const party = session.parties.find((p) => p.id === member.partyId);
    const content = generateSpeechContent(member, party || session.parties[0]);
    addSpeech(activeMotion.id, member.id, content);
    removeFromQueue(member.id);
    const updated = useSessionStore.getState().session;
    const m = updated?.motions.find((mm) => mm.id === activeMotion.id);
    const last = m?.speeches[m.speeches.length - 1];
    if (last) setLatestSpeechId(last.id);
  };

  const handleAddAmendment = () => {
    if (!activeMotion || !amendmentText.trim() || !selectedMemberId) return;
    addAmendment(activeMotion.id, amendmentText, selectedMemberId);
    setAmendmentText("");
  };

  const handleStartDebate = () => {
    if (!activeMotion) return;
    updateMotion(activeMotion.id, { status: "debating" });
    setDebatePhase("opening");
  };

  const handleAddRuling = () => {
    addRuling(generateRuling());
  };

  const handleAdvancePhase = () => {
    if (debatePhase === "vote") {
      callDivision();
      navigate("/division");
      return;
    }
    advanceDebatePhase();
  };

  const currentPhaseIdx = PHASE_ORDER.indexOf(debatePhase);

  return (
    <div>
      <PageHeader title="议程与辩论" subtitle="Agenda & Debate" ornament="Order Paper" />

      {/* Debate phase tracker */}
      {activeMotion && activeMotion.status === "debating" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-parchment p-4 mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Scroll className="w-4 h-4 text-gold-dark" />
              <span className="font-inscription text-xs tracking-widest uppercase text-ink-muted">
                辩论阶段
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAutoMode(!autoMode)}
                className={[
                  "flex items-center gap-1 px-3 py-1.5 rounded-sm font-inscription text-xs transition-colors",
                  autoMode
                    ? "bg-lords-red text-parchment animate-pulse"
                    : "bg-ink/5 text-ink-muted hover:bg-ink/10",
                ].join(" ")}
              >
                <Zap className="w-3 h-3" />
                {autoMode ? "自动辩论中" : "自动辩论"}
              </button>
              <button
                type="button"
                onClick={handleAdvancePhase}
                className="btn-commons text-xs"
              >
                {debatePhase === "vote" ? (
                  <>
                    <Gavel className="w-3 h-3" />
                    发起表决
                  </>
                ) : (
                  <>
                    <ChevronRight className="w-3 h-3" />
                    下一阶段
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {PHASE_ORDER.map((phase, idx) => {
              const isCurrent = phase === debatePhase;
              const isPassed = idx < currentPhaseIdx;
              return (
                <div key={phase} className="flex items-center flex-1">
                  <motion.div
                    animate={isCurrent ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                    transition={{ duration: 2, repeat: isCurrent ? Infinity : 0 }}
                    className={[
                      "flex-1 text-center py-2 px-3 rounded-sm font-inscription text-xs tracking-wider uppercase transition-colors",
                      isCurrent
                        ? "bg-gold text-ink"
                        : isPassed
                        ? "bg-commons-green/20 text-commons-green"
                        : "bg-ink/5 text-ink-muted",
                    ].join(" ")}
                  >
                    {PHASE_LABELS[phase]}
                  </motion.div>
                  {idx < PHASE_ORDER.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-ink-muted flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Motions list */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card-parchment p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold">议题列表</h3>
              <button
                type="button"
                onClick={() => setShowMotionForm(!showMotionForm)}
                className="btn-ghost text-[10px]"
              >
                <Plus className="w-3 h-3" />
                新增
              </button>
            </div>

            <AnimatePresence>
              {showMotionForm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mb-3"
                >
                  <div className="space-y-2 bg-ink/5 p-3 rounded-sm">
                    <input
                      type="text"
                      value={newMotionTitle}
                      onChange={(e) => setNewMotionTitle(e.target.value)}
                      placeholder="议题标题"
                      className="w-full bg-parchment-light border border-ink/20 rounded-sm px-3 py-2 text-sm"
                    />
                    <textarea
                      value={newMotionDesc}
                      onChange={(e) => setNewMotionDesc(e.target.value)}
                      placeholder="议题描述"
                      rows={3}
                      className="w-full bg-parchment-light border border-ink/20 rounded-sm px-3 py-2 text-sm"
                    />
                    <button type="button" onClick={handleAddMotion} className="btn-brass w-full text-xs">
                      提交议题
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {session.motions.map((motion) => (
                <button
                  key={motion.id}
                  type="button"
                  onClick={() => setActiveMotion(motion.id)}
                  className={[
                    "w-full text-left p-3 rounded-sm border transition-all",
                    activeMotionId === motion.id
                      ? "bg-commons-green/10 border-commons-green"
                      : "bg-ink/5 border-transparent hover:bg-ink/10",
                  ].join(" ")}
                >
                  <div className="font-display font-bold text-sm">{motion.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={[
                        "text-[10px] font-inscription uppercase px-1.5 py-0.5 rounded-sm",
                        motion.status === "passed"
                          ? "bg-commons-green text-parchment"
                          : motion.status === "rejected"
                          ? "bg-lords-red text-parchment"
                          : motion.status === "debating"
                          ? "bg-gold text-ink"
                          : "bg-ink/10 text-ink-muted",
                      ].join(" ")}
                    >
                      {motion.status}
                    </span>
                    <span className="text-[10px] font-inscription uppercase text-ink-muted">
                      {motion.type}
                    </span>
                    <span className="text-[10px] font-mono text-ink-muted">
                      {motion.speeches.length} 发言
                    </span>
                  </div>
                </button>
              ))}
              {session.motions.length === 0 && (
                <p className="text-sm text-ink-muted text-center py-4">暂无议题</p>
              )}
            </div>
          </div>

          {/* Speech queue */}
          <div className="card-parchment p-4">
            <h3 className="font-display font-bold mb-3 flex items-center gap-2">
              <Mic className="w-4 h-4" />
              发言队列
              {speechQueue.length > 0 && (
                <span className="ml-auto text-xs font-mono bg-gold/20 text-gold-dark px-2 py-0.5 rounded-full">
                  {speechQueue.length}
                </span>
              )}
            </h3>
            <div className="space-y-2">
              <AnimatePresence>
                {speechQueue.map((item, index) => {
                  const member = session.members.find((m) => m.id === item.memberId);
                  const party = member
                    ? session.parties.find((p) => p.id === member.partyId)
                    : undefined;
                  if (!member) return null;
                  return (
                    <motion.div
                      key={item.memberId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      layout
                      className={[
                        "flex items-center gap-2 p-2 rounded-sm",
                        index === 0 ? "bg-gold/10 border border-gold/30" : "bg-ink/5",
                      ].join(" ")}
                    >
                      <span className="font-mono text-xs text-ink-muted w-5 text-center">
                        {index === 0 ? "▶" : index + 1}
                      </span>
                      <MemberAvatar member={member} party={party} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="font-body text-sm truncate">{member.name}</div>
                        <div className="font-inscription text-[9px] text-ink-muted uppercase">
                          {party?.abbreviation} · {item.isPointOfOrder ? "程序问题" : "发言"}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromQueue(item.memberId)}
                        className="text-ink-muted hover:text-lords-red text-xs px-1"
                      >
                        ×
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {speechQueue.length === 0 && (
                <p className="text-sm text-ink-muted text-center py-2">队列为空</p>
              )}
            </div>
          </div>
        </div>

        {/* Active debate */}
        <div className="lg:col-span-2 space-y-4">
          {activeMotion ? (
            <>
              <div className="card-parchment p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-inscription text-xs tracking-widest uppercase text-gold-dark mb-1">
                      当前议题 · {PHASE_LABELS[debatePhase]}
                    </div>
                    <h2 className="font-display text-2xl font-bold">{activeMotion.title}</h2>
                    <p className="font-body text-ink-muted mt-2">{activeMotion.description}</p>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    {activeMotion.status === "draft" && (
                      <button type="button" onClick={handleStartDebate} className="btn-commons text-xs">
                        <Play className="w-3 h-3" />
                        开启辩论
                      </button>
                    )}
                    {activeMotion.status === "debating" && (
                      <button
                        type="button"
                        onClick={autoDebate}
                        className="btn-brass text-xs"
                      >
                        <FastForward className="w-3 h-3" />
                        快进一轮
                      </button>
                    )}
                    <button type="button" onClick={handleAddRuling} className="btn-ghost text-xs">
                      <AlertTriangle className="w-3 h-3" />
                      程序裁定
                    </button>
                  </div>
                </div>
              </div>

              {/* Add speech */}
              {activeMotion.status === "debating" && (
                <div className="card-parchment p-5">
                  <h3 className="font-display font-bold mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    提请发言
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <select
                      value={selectedMemberId}
                      onChange={(e) => setSelectedMemberId(e.target.value)}
                      className="md:col-span-2 bg-parchment-light border border-ink/20 rounded-sm px-3 py-2 text-sm"
                    >
                      <option value="">选择议员</option>
                      {session.members
                        .filter((m) => m.isPresent)
                        .map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({session.parties.find((p) => p.id === m.partyId)?.abbreviation})
                          </option>
                        ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => selectedMemberId && addToQueue(selectedMemberId)}
                      className="btn-ghost text-xs"
                    >
                      加入队列
                    </button>
                  </div>
                  <textarea
                    value={speechContent}
                    onChange={(e) => setSpeechContent(e.target.value)}
                    placeholder="输入发言内容，或留空使用 AI 生成"
                    rows={2}
                    className="w-full bg-parchment-light border border-ink/20 rounded-sm px-3 py-2 text-sm mb-3"
                  />
                  <div className="flex gap-2">
                    <button type="button" onClick={handleAddSpeech} className="btn-brass text-xs" disabled={!selectedMemberId}>
                      发表演讲
                    </button>
                    <button type="button" onClick={handleAutoSpeech} className="btn-ghost text-xs" disabled={!selectedMemberId}>
                      自动生成发言
                    </button>
                  </div>
                </div>
              )}

              {/* Amendments */}
              <div className="card-parchment p-5">
                <h3 className="font-display font-bold mb-3 flex items-center gap-2">
                  <FilePlus className="w-4 h-4" />
                  修正案
                  {activeMotion.amendments.length > 0 && (
                    <span className="ml-auto text-xs font-mono bg-ink/10 px-2 py-0.5 rounded-full">
                      {activeMotion.amendments.length}
                    </span>
                  )}
                </h3>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={amendmentText}
                    onChange={(e) => setAmendmentText(e.target.value)}
                    placeholder="修正案内容"
                    className="flex-1 bg-parchment-light border border-ink/20 rounded-sm px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddAmendment}
                    className="btn-ghost text-xs"
                    disabled={!amendmentText.trim() || !selectedMemberId}
                  >
                    提交
                  </button>
                </div>
                <div className="space-y-2">
                  {activeMotion.amendments.map((amendment) => {
                    const proposer = session.members.find((m) => m.id === amendment.proposerId);
                    return (
                      <div
                        key={amendment.id}
                        className="flex items-center justify-between p-2 bg-ink/5 rounded-sm"
                      >
                        <div>
                          <span className="font-body text-sm">{amendment.description}</span>
                          {proposer && (
                            <span className="font-inscription text-[10px] text-ink-muted ml-2">
                              — {proposer.name}
                            </span>
                          )}
                        </div>
                        <span
                          className={[
                            "text-[10px] font-inscription px-2 py-0.5 rounded-sm",
                            amendment.status === "passed"
                              ? "bg-commons-green text-parchment"
                              : amendment.status === "rejected"
                              ? "bg-lords-red text-parchment"
                              : "bg-gold/20 text-gold-dark",
                          ].join(" ")}
                        >
                          {amendment.status}
                        </span>
                      </div>
                    );
                  })}
                  {activeMotion.amendments.length === 0 && (
                    <p className="text-sm text-ink-muted text-center py-2">暂无修正案</p>
                  )}
                </div>
              </div>

              {/* Speeches / Debate record */}
              <div className="card-parchment p-5">
                <h3 className="font-display font-bold mb-3 flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  辩论记录
                  {activeMotion.speeches.length > 0 && (
                    <span className="ml-auto text-xs font-mono bg-ink/10 px-2 py-0.5 rounded-full">
                      {activeMotion.speeches.length}
                    </span>
                  )}
                </h3>
                <div ref={speechListRef} className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  <AnimatePresence initial={false}>
                    {activeMotion.speeches.map((speech, idx) => {
                      const member = session.members.find((m) => m.id === speech.memberId);
                      const party = member
                        ? session.parties.find((p) => p.id === member.partyId)
                        : undefined;
                      if (!member) return null;
                      const isLatest = speech.id === latestSpeechId;
                      const isGov = party?.isGovernment;
                      return (
                        <motion.div
                          key={speech.id}
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className={[
                            "border-l-2 pl-4 py-2 rounded-r-sm",
                            isGov ? "border-commons-green" : "border-lords-red",
                            isLatest ? "bg-gold/5" : "",
                          ].join(" ")}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <MemberAvatar member={member} party={party} size="sm" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-display font-bold text-sm">{member.name}</span>
                                <span
                                  className="font-inscription text-[9px] px-1.5 py-0.5 rounded-sm uppercase"
                                  style={{
                                    backgroundColor: party?.color + "20",
                                    color: party?.color,
                                  }}
                                >
                                  {party?.abbreviation}
                                </span>
                                {isGov && (
                                  <span className="font-inscription text-[8px] px-1 py-0.5 bg-gold/20 text-gold-dark rounded-sm uppercase">
                                    执政党
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1 font-inscription text-[9px] text-ink-muted">
                                <Clock className="w-2.5 h-2.5" />
                                {formatShortTime(speech.timestamp)}
                                <span className="mx-1">·</span>
                                口才 {member.eloquence}
                                {speech.isPointOfOrder && (
                                  <span className="ml-1 text-lords-red">[程序问题]</span>
                                )}
                              </div>
                            </div>
                            <span className="font-mono text-[10px] text-ink-muted">#{idx + 1}</span>
                          </div>
                          <p className="font-body text-ink/90 leading-relaxed text-sm">{speech.content}</p>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  {activeMotion.speeches.length === 0 && (
                    <div className="text-center py-8">
                      <MessageSquare className="w-10 h-10 mx-auto text-ink-muted mb-2" />
                      <p className="text-sm text-ink-muted">
                        {activeMotion.status === "debating"
                          ? "辩论已开始，等待发言"
                          : "请先开启辩论"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="card-parchment p-8 text-center">
              <MessageSquare className="w-12 h-12 mx-auto text-ink-muted mb-3" />
              <p className="font-body text-lg text-ink-muted">请从左侧选择一个议题开始辩论</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
