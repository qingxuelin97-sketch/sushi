import type {
  Session,
  Party,
  Member,
  Motion,
  VoteRecord,
  Vote,
  HansardEntry,
  EventRecord,
  VoteResult,
} from "@/types";
import {
  DEFAULT_PARTIES,
  generateMember,
  generateDicebearAvatar,
  MOTION_TEMPLATES,
  SPEECH_TEMPLATES,
  RULING_TEMPLATES,
  randomItem,
  randomInt,
  EVENT_TEMPLATES,
} from "@/data/defaults";

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createSpeaker(name = "John Bercow"): Session["speaker"] {
  return {
    id: generateId("speaker"),
    name,
    title: "议长先生",
    avatar: generateDicebearAvatar(`speaker-${name}`),
  };
}

export function createDefaultSession(
  name = "大不列颠议会模拟",
  year = new Date().getFullYear()
): Session {
  const parties: Party[] = DEFAULT_PARTIES.map((p) => ({
    ...p,
    leaderId: "",
    seats: 0,
  }));

  const members: Member[] = [];
  const seatDistribution = [35, 30, 12, 8, 7, 8];

  parties.forEach((party, partyIndex) => {
    const count = seatDistribution[partyIndex] || 8;
    const partyMembers: Member[] = [];
    for (let i = 0; i < count; i++) {
      const member = generateMember(party.id, members.length + i);
      partyMembers.push(member);
    }
    members.push(...partyMembers);
    party.leaderId = partyMembers[0]?.id || "";
    party.seats = count;
  });

  return {
    id: generateId("session"),
    name,
    year,
    chamber: "commons",
    speaker: createSpeaker(),
    parties,
    members,
    motions: [],
    hansard: [],
    events: [],
    publicOpinion: 50,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function createMotion(
  session: Session,
  templateIndex = randomInt(0, MOTION_TEMPLATES.length - 1)
): Motion {
  const template = MOTION_TEMPLATES[templateIndex];
  const proposer = randomItem(session.members.filter((m) => m.isPresent));
  return {
    id: generateId("motion"),
    title: template.title,
    type: template.type,
    description: template.description,
    proposerId: proposer?.id || session.members[0]?.id || "",
    status: "draft",
    speeches: [],
    amendments: [],
    createdAt: Date.now(),
  };
}

export function formatTimestamp(ts: number): string {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(ts));
}

export function formatShortTime(ts: number): string {
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ts));
}

export function determineMemberVote(
  member: Member,
  party: Party,
  publicOpinion: number
): Vote {
  const baseStance = party.stance || "no";
  const whip = party.whipStrength / 100;
  const loyalty = member.loyalty / 100;
  const cohesion = (whip + loyalty) / 2;

  let rebelChance = 1 - cohesion;

  if (member.isRebel) rebelChance += 0.25;
  if (member.traits.includes("叛逆") || member.traits.includes("独立思想")) {
    rebelChance += 0.1;
  }
  if (member.traits.includes("忠诚") || member.traits.includes("纪律严明")) {
    rebelChance -= 0.1;
  }

  // Public opinion influences rebels
  if (baseStance === "no" && publicOpinion > 65) rebelChance += 0.08;
  if (baseStance === "aye" && publicOpinion < 35) rebelChance += 0.08;

  rebelChance = Math.max(0.02, Math.min(0.85, rebelChance));

  if (Math.random() < rebelChance) {
    // Rebel: choose opposite or abstain
    const r = Math.random();
    if (baseStance === "aye") return r < 0.7 ? "no" : "abstain";
    if (baseStance === "no") return r < 0.7 ? "aye" : "abstain";
    return r < 0.5 ? "aye" : "no";
  }

  return baseStance;
}

export function calculateDivision(
  session: Session,
  motion: Motion,
  threshold: VoteResult["threshold"] = "simple-majority"
): VoteResult {
  const records: VoteRecord[] = [];
  const presentMembers = session.members.filter((m) => m.isPresent);

  presentMembers.forEach((member) => {
    const party = session.parties.find((p) => p.id === member.partyId);
    if (!party) return;
    const vote = determineMemberVote(member, party, session.publicOpinion);
    records.push({ memberId: member.id, vote, reason: undefined });
  });

  const aye = records.filter((r) => r.vote === "aye").length;
  const no = records.filter((r) => r.vote === "no").length;
  const abstain = records.filter((r) => r.vote === "abstain").length;

  let passed = false;
  if (threshold === "two-thirds") {
    passed = aye / (aye + no + abstain) > 2 / 3;
  } else {
    passed = aye > no;
  }

  return {
    aye,
    no,
    abstain,
    threshold,
    passed,
    records,
  };
}

export function generateSpeechContent(member: Member, party: Party): string {
  const stance = party.stance || "no";
  const templates = SPEECH_TEMPLATES[stance] || SPEECH_TEMPLATES.no;
  const base = randomItem(templates);
  if (member.traits.includes("雄辩")) {
    return `${base} 我必须强调，这不仅是程序问题，更是关乎我们国家荣誉的重大抉择。`;
  }
  if (member.traits.includes("务实")) {
    return `${base} 让我们抛开意识形态，专注于 measurable outcomes。`;
  }
  return base;
}

export function generateRuling(): string {
  return randomItem(RULING_TEMPLATES);
}

export function generateHansardEntry(
  type: HansardEntry["type"],
  content: string,
  actorName: string,
  actorTitle: string
): HansardEntry {
  return {
    id: generateId("hansard"),
    type,
    timestamp: Date.now(),
    content,
    actorName,
    actorTitle,
  };
}

export function triggerRandomEvent(): EventRecord | null {
  const eligible = EVENT_TEMPLATES.filter((t) => Math.random() < t.probability);
  if (eligible.length === 0) return null;
  const template = randomItem(eligible);
  return {
    id: generateId("event"),
    templateId: template.id,
    title: template.title,
    description: template.description,
    impact: template.impacts,
    resolved: false,
    timestamp: Date.now(),
  };
}

export function applyEventImpacts(session: Session, event: EventRecord): Session {
  const next = { ...session };
  event.impact.forEach((impact) => {
    if (impact.targetType === "opinion") {
      next.publicOpinion = Math.max(
        0,
        Math.min(100, next.publicOpinion + impact.delta)
      );
    } else if (impact.targetType === "party" && impact.targetId) {
      next.parties = next.parties.map((p) =>
        p.id === impact.targetId
          ? { ...p, whipStrength: Math.max(0, Math.min(100, p.whipStrength + impact.delta)) }
          : p
      );
    } else if (impact.targetType === "member" && impact.targetId) {
      next.members = next.members.map((m) =>
        m.id === impact.targetId
          ? { ...m, loyalty: Math.max(0, Math.min(100, m.loyalty + impact.delta)) }
          : m
      );
    }
  });
  return next;
}

export function exportSessionAsJSON(session: Session): string {
  return JSON.stringify(session, null, 2);
}

export function exportHansardAsMarkdown(session: Session): string {
  const header = `# ${session.name} · ${session.year}\n\n> 汉萨德议事录官方摘要\n\n`;
  const entries = session.hansard
    .map(
      (entry) =>
        `## ${formatTimestamp(entry.timestamp)}\n\n**${entry.actorTitle} ${entry.actorName}** [${entry.type}]\n\n${entry.content}\n\n---\n`
    )
    .join("\n");
  return header + entries;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
