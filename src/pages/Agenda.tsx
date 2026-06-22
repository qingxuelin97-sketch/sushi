import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Mic, MessageSquare, FilePlus, Gavel, AlertTriangle } from "lucide-react";
import { useSessionStore } from "@/store/sessionStore";
import PageHeader from "@/components/PageHeader";
import MemberAvatar from "@/components/MemberAvatar";
import { generateSpeechContent, generateRuling } from "@/utils/helpers";
import type { Motion } from "@/types";

export default function Agenda() {
  const session = useSessionStore((s) => s.session);
  const activeMotionId = useSessionStore((s) => s.activeMotionId);
  const speechQueue = useSessionStore((s) => s.speechQueue);
  const {
    setActiveMotion,
    updateMotion,
    addSpeech,
    addToQueue,
    removeFromQueue,
    addRuling,
    addAmendment,
  } = useSessionStore();

  const [newMotionTitle, setNewMotionTitle] = useState("");
  const [newMotionDesc, setNewMotionDesc] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [speechContent, setSpeechContent] = useState("");
  const [amendmentText, setAmendmentText] = useState("");
  const [showMotionForm, setShowMotionForm] = useState(false);

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
    const content = speechContent || generateSpeechForMember(selectedMemberId);
    addSpeech(activeMotion.id, selectedMemberId, content);
    removeFromQueue(selectedMemberId);
    setSpeechContent("");
  };

  const handleAutoSpeech = () => {
    if (!activeMotion) return;
    const member = session.members.find((m) => m.id === selectedMemberId);
    if (!member) return;
    const party = session.parties.find((p) => p.id === member.partyId);
    const content = generateSpeechContent(member, party || session.parties[0]);
    addSpeech(activeMotion.id, member.id, content);
    removeFromQueue(member.id);
  };

  const generateSpeechForMember = (memberId: string) => {
    const member = session.members.find((m) => m.id === memberId);
    if (!member) return "";
    const party = session.parties.find((p) => p.id === member.partyId);
    return generateSpeechContent(member, party || session.parties[0]);
  };

  const handleAddAmendment = () => {
    if (!activeMotion || !amendmentText.trim() || !selectedMemberId) return;
    addAmendment(activeMotion.id, amendmentText, selectedMemberId);
    setAmendmentText("");
  };

  const handleStartDebate = () => {
    if (!activeMotion) return;
    updateMotion(activeMotion.id, { status: "debating" });
  };

  const handleAddRuling = () => {
    addRuling(generateRuling());
  };

  return (
    <div>
      <PageHeader title="议程与辩论" subtitle="Agenda & Debate" ornament="Order Paper" />

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

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
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
                    <span className="text-[10px] font-inscription uppercase px-1.5 py-0.5 bg-ink/10 rounded-sm">
                      {motion.type}
                    </span>
                    <span className="text-[10px] font-inscription uppercase px-1.5 py-0.5 bg-ink/10 rounded-sm">
                      {motion.status}
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
            </h3>
            <div className="space-y-2">
              {speechQueue.map((item, index) => {
                const member = session.members.find((m) => m.id === item.memberId);
                const party = member
                  ? session.parties.find((p) => p.id === member.partyId)
                  : undefined;
                return (
                  <div
                    key={item.memberId}
                    className="flex items-center gap-2 p-2 bg-ink/5 rounded-sm"
                  >
                    <span className="font-mono text-xs text-ink-muted w-4">{index + 1}</span>
                    <MemberAvatar member={member!} party={party} size="sm" />
                    <span className="font-body text-sm flex-1">{member?.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFromQueue(item.memberId)}
                      className="text-ink-muted hover:text-lords-red text-xs"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
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
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-inscription text-xs tracking-widest uppercase text-gold-dark mb-1">
                      当前议题
                    </div>
                    <h2 className="font-display text-2xl font-bold">{activeMotion.title}</h2>
                    <p className="font-body text-ink-muted mt-2">{activeMotion.description}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {activeMotion.status === "draft" && (
                      <button type="button" onClick={handleStartDebate} className="btn-commons text-xs">
                        <Gavel className="w-3 h-3" />
                        开启辩论
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
                  rows={3}
                  className="w-full bg-parchment-light border border-ink/20 rounded-sm px-3 py-2 text-sm mb-3"
                />
                <div className="flex gap-2">
                  <button type="button" onClick={handleAddSpeech} className="btn-brass text-xs">
                    发表演讲
                  </button>
                  <button type="button" onClick={handleAutoSpeech} className="btn-ghost text-xs">
                    自动生成发言
                  </button>
                </div>
              </div>

              {/* Amendments */}
              <div className="card-parchment p-5">
                <h3 className="font-display font-bold mb-3 flex items-center gap-2">
                  <FilePlus className="w-4 h-4" />
                  修正案
                </h3>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={amendmentText}
                    onChange={(e) => setAmendmentText(e.target.value)}
                    placeholder="修正案内容"
                    className="flex-1 bg-parchment-light border border-ink/20 rounded-sm px-3 py-2 text-sm"
                  />
                  <button type="button" onClick={handleAddAmendment} className="btn-ghost text-xs">
                    提交
                  </button>
                </div>
                <div className="space-y-2">
                  {activeMotion.amendments.map((amendment) => (
                    <div
                      key={amendment.id}
                      className="flex items-center justify-between p-2 bg-ink/5 rounded-sm"
                    >
                      <span className="font-body text-sm">{amendment.description}</span>
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
                  ))}
                </div>
              </div>

              {/* Speeches */}
              <div className="card-parchment p-5">
                <h3 className="font-display font-bold mb-3">辩论记录</h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {activeMotion.speeches.map((speech) => {
                    const member = session.members.find((m) => m.id === speech.memberId);
                    const party = member
                      ? session.parties.find((p) => p.id === member.partyId)
                      : undefined;
                    return (
                      <div key={speech.id} className="border-l-2 border-gold/40 pl-4 py-1">
                        <div className="flex items-center gap-2 mb-1">
                          <MemberAvatar member={member!} party={party} size="sm" />
                          <span className="font-display font-bold text-sm">{member?.name}</span>
                          <span className="font-inscription text-[10px] text-ink-muted">
                            {party?.abbreviation}
                          </span>
                        </div>
                        <p className="font-body text-ink/90">{speech.content}</p>
                      </div>
                    );
                  })}
                  {activeMotion.speeches.length === 0 && (
                    <p className="text-sm text-ink-muted text-center py-4">暂无发言</p>
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
