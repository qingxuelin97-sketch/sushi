import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Session,
  Motion,
  Member,
  Party,
  Speech,
  Amendment,
  HansardEntry,
  Vote,
  VoteThreshold,
  SpeechQueueItem,
  DivisionState,
} from "@/types";
import {
  createDefaultSession,
  createMotion,
  generateHansardEntry,
  calculateDivision,
  triggerRandomEvent,
  applyEventImpacts,
  generateId,
  generateSpeechContent,
  generateRuling,
} from "@/utils/helpers";

export type DebatePhase = "opening" | "arguments" | "rebuttal" | "closing" | "vote";

interface SessionState {
  session: Session | null;
  activeMotionId: string | null;
  speechQueue: SpeechQueueItem[];
  division: DivisionState;
  debatePhase: DebatePhase;
  lastSpeechAt: number | null;

  // Session lifecycle
  createSession: (name: string, year: number) => void;
  loadSession: (session: Session) => void;
  resetSession: () => void;
  updateSession: (updates: Partial<Session>) => void;

  // Motions
  addMotion: (templateIndex?: number) => void;
  setActiveMotion: (motionId: string | null) => void;
  updateMotion: (motionId: string, updates: Partial<Motion>) => void;
  addAmendment: (motionId: string, description: string, proposerId: string) => void;
  resolveAmendment: (motionId: string, amendmentId: string, status: Amendment["status"]) => void;

  // Members / Parties
  updateMember: (memberId: string, updates: Partial<Member>) => void;
  updateParty: (partyId: string, updates: Partial<Party>) => void;
  setPartyStance: (partyId: string, stance: Vote | undefined) => void;

  // Debate
  addSpeech: (motionId: string, memberId: string, content: string, isPointOfOrder?: boolean) => void;
  addToQueue: (memberId: string, isPointOfOrder?: boolean) => void;
  removeFromQueue: (memberId: string) => void;
  reorderQueue: (memberIds: string[]) => void;
  addRuling: (content: string) => void;
  setDebatePhase: (phase: DebatePhase) => void;
  advanceDebatePhase: () => void;
  autoDebate: () => void;
  callDivision: () => void;

  // Division
  startDivision: (motionId: string) => void;
  advanceDivision: () => void;
  completeDivision: (threshold?: VoteThreshold) => void;
  resetDivision: () => void;

  // Events
  triggerEvent: () => void;
  resolveEvent: (eventId: string) => void;

  // Hansard
  addHansardEntry: (entry: Omit<HansardEntry, "id" | "timestamp">) => void;

  // Utilities
  getActiveMotion: () => Motion | undefined;
  getMember: (memberId: string) => Member | undefined;
  getParty: (partyId: string) => Party | undefined;
}

const initialDivision: DivisionState = {
  isActive: false,
  motionId: null,
  phase: "idle",
  elapsedSeconds: 0,
  progressByParty: {},
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      session: null,
      activeMotionId: null,
      speechQueue: [],
      division: initialDivision,
      debatePhase: "opening",
      lastSpeechAt: null,

      createSession: (name, year) => {
        const session = createDefaultSession(name, year);
        set({ session, activeMotionId: null, speechQueue: [], division: initialDivision, debatePhase: "opening", lastSpeechAt: null });
      },

      loadSession: (session) => {
        set({ session, activeMotionId: null, speechQueue: [], division: initialDivision, debatePhase: "opening", lastSpeechAt: null });
      },

      resetSession: () => {
        set({ session: null, activeMotionId: null, speechQueue: [], division: initialDivision, debatePhase: "opening", lastSpeechAt: null });
      },

      updateSession: (updates) => {
        set((state) => ({
          session: state.session
            ? { ...state.session, ...updates, updatedAt: Date.now() }
            : null,
        }));
      },

      addMotion: (templateIndex) => {
        const { session } = get();
        if (!session) return;
        const motion = createMotion(session, templateIndex);
        set((state) => ({
          session: state.session
            ? {
                ...state.session,
                motions: [...state.session.motions, motion],
                updatedAt: Date.now(),
              }
            : null,
          activeMotionId: motion.id,
        }));
      },

      setActiveMotion: (motionId) => set({ activeMotionId: motionId }),

      updateMotion: (motionId, updates) => {
        set((state) => ({
          session: state.session
            ? {
                ...state.session,
                motions: state.session.motions.map((m) =>
                  m.id === motionId ? { ...m, ...updates } : m
                ),
                updatedAt: Date.now(),
              }
            : null,
        }));
      },

      addAmendment: (motionId, description, proposerId) => {
        set((state) => ({
          session: state.session
            ? {
                ...state.session,
                motions: state.session.motions.map((m) =>
                  m.id === motionId
                    ? {
                        ...m,
                        amendments: [
                          ...m.amendments,
                          {
                            id: generateId("amendment"),
                            motionId,
                            description,
                            proposerId,
                            status: "pending",
                          },
                        ],
                      }
                    : m
                ),
                updatedAt: Date.now(),
              }
            : null,
        }));
      },

      resolveAmendment: (motionId, amendmentId, status) => {
        set((state) => ({
          session: state.session
            ? {
                ...state.session,
                motions: state.session.motions.map((m) =>
                  m.id === motionId
                    ? {
                        ...m,
                        amendments: m.amendments.map((a) =>
                          a.id === amendmentId ? { ...a, status } : a
                        ),
                      }
                    : m
                ),
                updatedAt: Date.now(),
              }
            : null,
        }));
      },

      updateMember: (memberId, updates) => {
        set((state) => ({
          session: state.session
            ? {
                ...state.session,
                members: state.session.members.map((m) =>
                  m.id === memberId ? { ...m, ...updates } : m
                ),
                updatedAt: Date.now(),
              }
            : null,
        }));
      },

      updateParty: (partyId, updates) => {
        set((state) => ({
          session: state.session
            ? {
                ...state.session,
                parties: state.session.parties.map((p) =>
                  p.id === partyId ? { ...p, ...updates } : p
                ),
                updatedAt: Date.now(),
              }
            : null,
        }));
      },

      setPartyStance: (partyId, stance) => {
        set((state) => ({
          session: state.session
            ? {
                ...state.session,
                parties: state.session.parties.map((p) =>
                  p.id === partyId ? { ...p, stance } : p
                ),
                updatedAt: Date.now(),
              }
            : null,
        }));
      },

      addSpeech: (motionId, memberId, content, isPointOfOrder = false) => {
        const { session, addHansardEntry } = get();
        if (!session) return;
        const member = session.members.find((m) => m.id === memberId);
        const party = member
          ? session.parties.find((p) => p.id === member.partyId)
          : undefined;

        const speech: Speech = {
          id: generateId("speech"),
          memberId,
          content,
          timestamp: Date.now(),
          durationSeconds: Math.max(30, Math.floor(content.length / 4)),
          isPointOfOrder,
        };

        set((state) => ({
          session: state.session
            ? {
                ...state.session,
                motions: state.session.motions.map((m) =>
                  m.id === motionId
                    ? { ...m, speeches: [...m.speeches, speech] }
                    : m
                ),
                updatedAt: Date.now(),
              }
            : null,
        }));

        addHansardEntry({
          type: isPointOfOrder ? "ruling" : "speech",
          content,
          actorName: member?.name || "未知议员",
          actorTitle: isPointOfOrder ? "程序问题" : party?.abbreviation || "MP",
        });
      },

      addToQueue: (memberId, isPointOfOrder = false) => {
        set((state) => ({
          speechQueue: [
            ...state.speechQueue,
            { memberId, isPointOfOrder, registeredAt: Date.now() },
          ],
        }));
      },

      removeFromQueue: (memberId) => {
        set((state) => ({
          speechQueue: state.speechQueue.filter((q) => q.memberId !== memberId),
        }));
      },

      reorderQueue: (memberIds) => {
        set((state) => {
          const map = new Map(
            state.speechQueue.map((q) => [q.memberId, q])
          );
          return {
            speechQueue: memberIds
              .map((id) => map.get(id))
              .filter(Boolean) as SpeechQueueItem[],
          };
        });
      },

      addRuling: (content) => {
        const { session, addHansardEntry } = get();
        if (!session) return;
        addHansardEntry({
          type: "ruling",
          content,
          actorName: session.speaker.name,
          actorTitle: "议长",
        });
      },

      setDebatePhase: (phase) => set({ debatePhase: phase }),

      advanceDebatePhase: () => {
        const { debatePhase } = get();
        const order: DebatePhase[] = ["opening", "arguments", "rebuttal", "closing", "vote"];
        const idx = order.indexOf(debatePhase);
        const next = order[Math.min(idx + 1, order.length - 1)];
        set({ debatePhase: next });
      },

      autoDebate: () => {
        const { session, activeMotionId, debatePhase, addSpeech, addRuling } = get();
        if (!session || !activeMotionId) return;

        const motion = session.motions.find((m) => m.id === activeMotionId);
        if (!motion) return;

        // Pick speakers: one from government, one from opposition, alternating
        const govParties = session.parties.filter((p) => p.isGovernment);
        const oppParties = session.parties.filter((p) => !p.isGovernment);
        const govMembers = session.members.filter(
          (m) => m.isPresent && govParties.some((p) => p.id === m.partyId)
        );
        const oppMembers = session.members.filter(
          (m) => m.isPresent && oppParties.some((p) => p.id === m.partyId)
        );

        // Sort by eloquence for better speeches
        const topGov = [...govMembers].sort((a, b) => b.eloquence - a.eloquence).slice(0, 5);
        const topOpp = [...oppMembers].sort((a, b) => b.eloquence - a.eloquence).slice(0, 5);

        const speechesPerPhase: Record<DebatePhase, number> = {
          opening: 2,
          arguments: 4,
          rebuttal: 4,
          closing: 2,
          vote: 0,
        };

        const count = speechesPerPhase[debatePhase] || 2;
        for (let i = 0; i < count; i++) {
          const isGov = i % 2 === 0;
          const pool = isGov ? topGov : topOpp;
          const member = pool[i % pool.length];
          if (!member) continue;
          const party = session.parties.find((p) => p.id === member.partyId);
          if (!party) continue;
          const content = generateSpeechContent(member, party);
          addSpeech(motion.id, member.id, content);
        }

        // Occasionally add a ruling
        if (Math.random() < 0.3) {
          addRuling(generateRuling());
        }

        // Impact on public opinion based on debate quality
        const avgEloquence =
          [topGov[0], topOpp[0]].filter(Boolean).reduce((s, m) => s + (m?.eloquence || 0), 0) / 2;
        const opinionDelta = Math.round((avgEloquence - 60) / 10);
        if (opinionDelta !== 0) {
          const { session: s, updateSession } = get();
          if (s) {
            updateSession({
              publicOpinion: Math.max(0, Math.min(100, s.publicOpinion + opinionDelta)),
            });
          }
        }

        set({ lastSpeechAt: Date.now() });
      },

      callDivision: () => {
        const { session, activeMotionId, updateMotion, startDivision, addHansardEntry } = get();
        if (!session || !activeMotionId) return;
        updateMotion(activeMotionId, { status: "voting" });
        addHansardEntry({
          type: "ruling",
          content: "议长宣布辩论结束，本院进入分组表决。",
          actorName: session.speaker.name,
          actorTitle: "议长",
        });
        startDivision(activeMotionId);
        set({ debatePhase: "vote" });
      },

      startDivision: (motionId) => {
        const { session } = get();
        if (!session) return;

        const progressByParty: DivisionState["progressByParty"] = {};
        session.parties.forEach((p) => {
          progressByParty[p.id] = { aye: 0, no: 0, abstain: 0 };
        });

        set({
          division: {
            isActive: true,
            motionId,
            phase: "bell",
            elapsedSeconds: 0,
            progressByParty,
          },
        });
      },

      advanceDivision: () => {
        const { division, session } = get();
        if (!session || !division.isActive) return;

        if (division.phase === "bell") {
          set({ division: { ...division, phase: "voting" } });
        } else if (division.phase === "voting") {
          // Simulate partial progress
          const presentMembers = session.members.filter((m) => m.isPresent);
          const progressByParty = { ...division.progressByParty };
          presentMembers.forEach((m) => {
            const party = session.parties.find((p) => p.id === m.partyId);
            if (!party) return;
            const r = Math.random();
            const bucket = progressByParty[party.id] || { aye: 0, no: 0, abstain: 0 };
            if (r < 0.45) bucket.aye += 1;
            else if (r < 0.9) bucket.no += 1;
            else bucket.abstain += 1;
            progressByParty[party.id] = bucket;
          });
          set({ division: { ...division, phase: "tally", progressByParty } });
        } else if (division.phase === "tally") {
          set({ division: { ...division, phase: "result" } });
        }
      },

      completeDivision: (threshold = "simple-majority") => {
        const { session, division, getActiveMotion, addHansardEntry } = get();
        if (!session || !division.motionId) return;

        const motion = getActiveMotion();
        if (!motion) return;

        const result = calculateDivision(session, motion, threshold);

        set((state) => ({
          session: state.session
            ? {
                ...state.session,
                motions: state.session.motions.map((m) =>
                  m.id === motion.id
                    ? {
                        ...m,
                        status: result.passed ? "passed" : "rejected",
                        vote: result,
                      }
                    : m
                ),
                updatedAt: Date.now(),
              }
            : null,
          division: initialDivision,
        }));

        addHansardEntry({
          type: "vote",
          content: `表决结果：Aye ${result.aye} 票，No ${result.no} 票，弃权 ${result.abstain} 票。议案${result.passed ? "通过" : "被否决"}。`,
          actorName: session.speaker.name,
          actorTitle: "议长",
        });
      },

      resetDivision: () => set({ division: initialDivision }),

      triggerEvent: () => {
        const { session } = get();
        if (!session) return;
        const event = triggerRandomEvent();
        if (!event) return;
        const updated = applyEventImpacts(session, event);
        set({
          session: {
            ...updated,
            events: [...updated.events, event],
            hansard: [
              ...updated.hansard,
              generateHansardEntry(
                "event",
                event.description,
                event.title,
                "事件"
              ),
            ],
            updatedAt: Date.now(),
          },
        });
      },

      resolveEvent: (eventId) => {
        set((state) => ({
          session: state.session
            ? {
                ...state.session,
                events: state.session.events.map((e) =>
                  e.id === eventId ? { ...e, resolved: true } : e
                ),
                updatedAt: Date.now(),
              }
            : null,
        }));
      },

      addHansardEntry: (entry) => {
        set((state) => ({
          session: state.session
            ? {
                ...state.session,
                hansard: [
                  ...state.session.hansard,
                  { ...entry, id: generateId("hansard"), timestamp: Date.now() },
                ],
                updatedAt: Date.now(),
              }
            : null,
        }));
      },

      getActiveMotion: () => {
        const { session, activeMotionId } = get();
        return session?.motions.find((m) => m.id === activeMotionId);
      },

      getMember: (memberId) => get().session?.members.find((m) => m.id === memberId),

      getParty: (partyId) => get().session?.parties.find((p) => p.id === partyId),
    }),
    {
      name: "parliament-simulator-session-v1",
      partialize: (state) => ({
        session: state.session,
      }),
    }
  )
);
