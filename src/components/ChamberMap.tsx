import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Session, Member, Party } from "@/types";
import Seat from "./Seat";
import MemberTooltip from "./MemberTooltip";
import Mace from "./Mace";

interface ChamberMapProps {
  session: Session;
  activeMemberId?: string;
  speakingMemberId?: string;
  onMemberClick?: (member: Member) => void;
}

interface PlacedSeat {
  member: Member;
  party: Party;
  angle: number;
  radius: number;
}

const MIN_RADIUS = 150;
const MAX_RADIUS = 440;
const SEAT_SPACING = 34;
const GOV_ANGLES = { start: 10, end: 82 };
const OPP_ANGLES = { start: -82, end: -10 };

function distributeSide(
  members: Member[],
  parties: Party[],
  startAngle: number,
  endAngle: number
): PlacedSeat[] {
  const total = members.length;
  if (total === 0) return [];

  const span = endAngle - startAngle;
  const spanRad = (span * Math.PI) / 180;

  // Determine how many rows we need to fit everyone with comfortable spacing
  let rows = 1;
  while (rows < 12) {
    const step = (MAX_RADIUS - MIN_RADIUS) / Math.max(rows - 1, 1);
    let capacity = 0;
    for (let i = 0; i < rows; i++) {
      const radius = MIN_RADIUS + i * step;
      capacity += Math.max(1, Math.floor(spanRad * radius / SEAT_SPACING));
    }
    if (capacity >= total) break;
    rows++;
  }

  const step = (MAX_RADIUS - MIN_RADIUS) / Math.max(rows - 1, 1);
  const seats: PlacedSeat[] = [];
  let memberIndex = 0;

  for (let i = 0; i < rows; i++) {
    const radius = MIN_RADIUS + i * step;
    const capacity = Math.max(1, Math.floor(spanRad * radius / SEAT_SPACING));
    const remaining = total - memberIndex;
    const count = Math.min(capacity, remaining);
    if (count <= 0) break;

    const angleStep = span / Math.max(count - 1, 1);
    for (let j = 0; j < count; j++) {
      const member = members[memberIndex];
      const party = parties.find((p) => p.id === member.partyId);
      if (!party) continue;
      seats.push({
        member,
        party,
        angle: startAngle + angleStep * j,
        radius,
      });
      memberIndex++;
    }
  }

  return seats;
}

export default function ChamberMap({
  session,
  activeMemberId,
  speakingMemberId,
  onMemberClick,
}: ChamberMapProps) {
  const [tooltip, setTooltip] = useState<{
    member: Member;
    party: Party;
    x: number;
    y: number;
  } | null>(null);

  const { governmentSeats, oppositionSeats } = useMemo(() => {
    const governmentParties = session.parties.filter((p) => p.isGovernment);
    const oppositionParties = session.parties.filter((p) => !p.isGovernment);

    const govMembers = session.members
      .filter((m) => governmentParties.some((p) => p.id === m.partyId))
      .sort((a, b) => a.partyId.localeCompare(b.partyId) || a.name.localeCompare(b.name));

    const oppMembers = session.members
      .filter((m) => oppositionParties.some((p) => p.id === m.partyId))
      .sort((a, b) => a.partyId.localeCompare(b.partyId) || a.name.localeCompare(b.name));

    return {
      governmentSeats: distributeSide(govMembers, session.parties, GOV_ANGLES.start, GOV_ANGLES.end),
      oppositionSeats: distributeSide(oppMembers, session.parties, OPP_ANGLES.start, OPP_ANGLES.end),
    };
  }, [session]);

  const allSeats = useMemo(
    () => [...oppositionSeats, ...governmentSeats],
    [governmentSeats, oppositionSeats]
  );

  return (
    <div
      className="relative w-full h-[720px] rounded-t-[50%] border-x-[10px] border-b-0 border-wood shadow-2xl overflow-hidden bg-gradient-to-b from-commons-dark via-commons-green to-commons-dark"
      onMouseLeave={() => setTooltip(null)}
    >
      {/* Subtle light sweep */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-tr from-transparent via-gold/10 to-transparent animate-spotlight" />

      {/* Gothic window silhouette */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none">
        <div className="w-[70%] h-[70%] gothic-window bg-ink" />
      </div>

      {/* Wood floor at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-wood-dark to-transparent pointer-events-none" />

      {/* Dispatch box / despatch box */}
      <div className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-24 h-14 bg-wood border-2 border-gold-dark rounded-sm shadow-lg flex items-center justify-center">
          <Mace className="h-10 w-auto opacity-90" />
        </div>
        <div className="w-28 h-2 bg-gold-dark/60 rounded-full mx-auto mt-1" />
      </div>

      {/* Speaker chair */}
      <div className="absolute left-1/2 bottom-2 -translate-x-1/2 z-20 flex flex-col items-center">
        <div className="w-28 h-32 bg-wood border-4 border-gold-dark rounded-t-xl shadow-2xl flex flex-col items-center justify-center relative">
          <div className="absolute top-2 w-20 h-6 bg-gold/20 rounded-sm" />
          <span className="font-inscription text-gold-pale text-[10px] tracking-[0.2em] uppercase text-center mt-4">
            Speaker
          </span>
        </div>
        <div className="w-36 h-4 bg-wood-dark border-y border-gold-dark/40 rounded-full mt-1" />
      </div>

      {/* Seats */}
      {allSeats.map((seat, index) => (
        <Seat
          key={seat.member.id}
          member={seat.member}
          party={seat.party}
          angle={seat.angle}
          radius={seat.radius}
          index={index}
          isActive={activeMemberId === seat.member.id}
          isSpeaking={speakingMemberId === seat.member.id}
          onClick={() => onMemberClick?.(seat.member)}
          onHover={(member, party, x, y) => setTooltip({ member, party, x, y })}
          onLeave={() => setTooltip(null)}
        />
      ))}

      {/* Side labels */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
        className="absolute right-10 top-10 text-gold-pale/50 font-inscription text-xs tracking-[0.2em] uppercase rotate-12"
      >
        Government
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
        className="absolute left-10 top-10 text-gold-pale/50 font-inscription text-xs tracking-[0.2em] uppercase -rotate-12"
      >
        Opposition
      </motion.div>

      {/* Tooltip */}
      {tooltip && (
        <MemberTooltip
          member={tooltip.member}
          party={tooltip.party}
          x={tooltip.x}
          y={tooltip.y}
        />
      )}
    </div>
  );
}
