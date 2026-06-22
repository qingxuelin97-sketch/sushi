import { useState } from "react";
import { motion } from "framer-motion";
import { Gavel, Mic, Users, Clock, AlertCircle } from "lucide-react";
import { useSessionStore } from "@/store/sessionStore";
import PageHeader from "@/components/PageHeader";
import ChamberMap from "@/components/ChamberMap";
import MemberAvatar from "@/components/MemberAvatar";
import Timer from "@/components/Timer";
import Mace from "@/components/Mace";
import type { Member } from "@/types";

export default function Chamber() {
  const session = useSessionStore((s) => s.session);
  const speechQueue = useSessionStore((s) => s.speechQueue);
  const activeMotionId = useSessionStore((s) => s.activeMotionId);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  if (!session) {
    return (
      <div className="text-center py-20">
        <p className="font-body text-xl text-ink-muted">尚未创建议会会话</p>
      </div>
    );
  }

  const activeMotion = session.motions.find((m) => m.id === activeMotionId);
  const currentSpeaker = speechQueue[0]
    ? session.members.find((m) => m.id === speechQueue[0].memberId)
    : null;
  const currentParty = currentSpeaker
    ? session.parties.find((p) => p.id === currentSpeaker.partyId)
    : null;

  return (
    <div>
      <PageHeader
        title="议事厅"
        subtitle="The Chamber"
        ornament="Order · Order"
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Chamber map */}
        <div className="xl:col-span-2 space-y-4">
          <ChamberMap
            session={session}
            activeMemberId={selectedMember?.id}
            speakingMemberId={currentSpeaker?.id}
            onMemberClick={setSelectedMember}
          />

          {/* Current motion bar */}
          <div className="card-parchment p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-inscription text-xs tracking-widest uppercase text-ink-muted mb-1">
                  当前议题
                </div>
                <h3 className="font-display text-xl font-bold">
                  {activeMotion?.title || "暂无活跃议题"}
                </h3>
                <p className="font-body text-ink-muted line-clamp-2 mt-1">
                  {activeMotion?.description || "请在议程页面添加或选择一个议题。"}
                </p>
              </div>
              <div className="hidden sm:block">
                <Mace className="h-16 w-auto opacity-80" />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Speaker panel */}
          <div className="card-parchment p-5">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={session.speaker.avatar}
                alt={session.speaker.name}
                className="w-16 h-16 rounded-full border-2 border-gold object-cover bg-parchment"
              />
              <div>
                <div className="font-inscription text-xs tracking-widest uppercase text-gold-dark">
                  The Speaker
                </div>
                <div className="font-display text-xl font-bold">
                  {session.speaker.name}
                </div>
                <div className="font-body text-sm text-ink-muted">
                  {session.speaker.title}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-commons-green/5 p-2 rounded-sm">
                <Users className="w-4 h-4 mx-auto text-commons-green mb-1" />
                <div className="font-mono text-lg font-bold">{session.members.length}</div>
                <div className="font-inscription text-[10px] text-ink-muted">议员</div>
              </div>
              <div className="bg-commons-green/5 p-2 rounded-sm">
                <Mic className="w-4 h-4 mx-auto text-commons-green mb-1" />
                <div className="font-mono text-lg font-bold">{speechQueue.length}</div>
                <div className="font-inscription text-[10px] text-ink-muted">待发言</div>
              </div>
              <div className="bg-commons-green/5 p-2 rounded-sm">
                <Gavel className="w-4 h-4 mx-auto text-commons-green mb-1" />
                <div className="font-mono text-lg font-bold">{session.motions.length}</div>
                <div className="font-inscription text-[10px] text-ink-muted">议题</div>
              </div>
            </div>
          </div>

          {/* Current speaker */}
          <div className="card-parchment p-5">
            <div className="font-inscription text-xs tracking-widest uppercase text-ink-muted mb-3 flex items-center gap-2">
              <Mic className="w-3 h-3" />
              当前发言人
            </div>
            {currentSpeaker ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3"
              >
                <MemberAvatar
                  member={currentSpeaker}
                  party={currentParty}
                  size="md"
                  isSpeaking
                />
                <div className="flex-1">
                  <div className="font-display font-bold">{currentSpeaker.name}</div>
                  <div className="font-body text-sm text-ink-muted">
                    {currentParty?.name} · {currentSpeaker.constituency}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-commons-green">
                  <Clock className="w-4 h-4" />
                  <Timer seconds={180} isRunning />
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center gap-3 text-ink-muted">
                <AlertCircle className="w-5 h-5" />
                <span className="font-body">暂无议员发言</span>
              </div>
            )}
          </div>

          {/* Member detail */}
          {selectedMember && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-parchment p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <MemberAvatar
                  member={selectedMember}
                  party={session.parties.find((p) => p.id === selectedMember.partyId)}
                  size="lg"
                />
                <div>
                  <div className="font-display text-lg font-bold">
                    {selectedMember.name}
                  </div>
                  <div className="font-body text-sm text-ink-muted">
                    {session.parties.find((p) => p.id === selectedMember.partyId)?.name} ·{" "}
                    {selectedMember.constituency}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-inscription text-xs uppercase tracking-wider text-ink-muted">
                    口才
                  </span>
                  <span className="font-mono">{selectedMember.eloquence}</span>
                </div>
                <div className="w-full bg-ink/10 rounded-full h-1.5">
                  <div
                    className="bg-gold h-1.5 rounded-full"
                    style={{ width: `${selectedMember.eloquence}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-inscription text-xs uppercase tracking-wider text-ink-muted">
                    忠诚度
                  </span>
                  <span className="font-mono">{selectedMember.loyalty}</span>
                </div>
                <div className="w-full bg-ink/10 rounded-full h-1.5">
                  <div
                    className="bg-commons-green h-1.5 rounded-full"
                    style={{ width: `${selectedMember.loyalty}%` }}
                  />
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {selectedMember.traits.map((trait) => (
                    <span
                      key={trait}
                      className="px-2 py-0.5 bg-gold/10 text-gold-dark text-xs font-inscription rounded-sm"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
