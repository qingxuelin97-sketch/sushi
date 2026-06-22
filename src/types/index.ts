export type Chamber = "commons" | "lords";

export type MotionType = "bill" | "motion" | "question" | "no-confidence";

export type MotionStatus =
  | "draft"
  | "debating"
  | "voting"
  | "passed"
  | "rejected"
  | "withdrawn";

export type Vote = "aye" | "no" | "abstain";

export type VoteThreshold = "simple-majority" | "two-thirds";

export type HansardEntryType = "speech" | "vote" | "event" | "ruling";

export interface Speaker {
  id: string;
  name: string;
  title: string;
  avatar: string;
}

export interface Party {
  id: string;
  name: string;
  abbreviation: string;
  color: string;
  ideology: string;
  whipStrength: number;
  leaderId: string;
  seats: number;
  isGovernment: boolean;
  stance?: "aye" | "no" | "abstain"; // stance on current motion
}

export interface Member {
  id: string;
  name: string;
  constituency: string;
  partyId: string;
  avatar: string;
  eloquence: number;
  loyalty: number;
  attendance: number;
  isPresent: boolean;
  isRebel: boolean;
  traits: string[];
}

export interface Speech {
  id: string;
  memberId: string;
  content: string;
  timestamp: number;
  durationSeconds: number;
  isPointOfOrder: boolean;
}

export interface Amendment {
  id: string;
  motionId: string;
  description: string;
  proposerId: string;
  status: "pending" | "passed" | "rejected";
}

export interface VoteRecord {
  memberId: string;
  vote: Vote;
  reason?: string;
}

export interface VoteResult {
  aye: number;
  no: number;
  abstain: number;
  threshold: VoteThreshold;
  passed: boolean;
  records: VoteRecord[];
}

export interface Motion {
  id: string;
  title: string;
  type: MotionType;
  description: string;
  proposerId: string;
  status: MotionStatus;
  speeches: Speech[];
  amendments: Amendment[];
  vote?: VoteResult;
  createdAt: number;
}

export interface HansardEntry {
  id: string;
  type: HansardEntryType;
  timestamp: number;
  content: string;
  actorName: string;
  actorTitle: string;
}

export interface EventImpact {
  targetType: "party" | "member" | "opinion";
  targetId?: string;
  delta: number;
}

export interface EventTemplate {
  id: string;
  title: string;
  description: string;
  probability: number;
  impacts: EventImpact[];
}

export interface EventRecord {
  id: string;
  templateId: string;
  title: string;
  description: string;
  impact: EventImpact[];
  resolved: boolean;
  timestamp: number;
}

export interface Session {
  id: string;
  name: string;
  year: number;
  chamber: Chamber;
  speaker: Speaker;
  parties: Party[];
  members: Member[];
  motions: Motion[];
  hansard: HansardEntry[];
  events: EventRecord[];
  publicOpinion: number;
  createdAt: number;
  updatedAt: number;
}

export interface SpeechQueueItem {
  memberId: string;
  isPointOfOrder: boolean;
  registeredAt: number;
}

export interface DivisionState {
  isActive: boolean;
  motionId: string | null;
  phase: "idle" | "bell" | "voting" | "tally" | "result";
  elapsedSeconds: number;
  progressByParty: Record<string, { aye: number; no: number; abstain: number }>;
}
