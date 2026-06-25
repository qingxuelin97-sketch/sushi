import { useMemo, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import type { Session, Member, Party } from "@/types";
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
  xPct: number;
  yPct: number;
}

// Virtual coordinate system — all positions calculated here then converted to %
const VW = 1000;
const VH = 620;
const SPEAKER_X = VW / 2;
const SPEAKER_Y = VH - 30;

const SEAT_SIZE_PX = 26; // visual diameter of each seat dot
const ROW_SPACING = 42;
const MIN_RADIUS = 110;

function distributeSide(
  members: Member[],
  parties: Party[],
  startAngleDeg: number,
  endAngleDeg: number
): PlacedSeat[] {
  const total = members.length;
  if (total === 0) return [];

  const spanDeg = endAngleDeg - startAngleDeg;
  const spanRad = (spanDeg * Math.PI) / 180;

  // Determine rows needed
  let rows = 1;
  while (rows < 10) {
    let cap = 0;
    for (let i = 0; i < rows; i++) {
      const r = MIN_RADIUS + i * ROW_SPACING;
      const arcLen = r * spanRad;
      cap += Math.max(1, Math.floor(arcLen / SEAT_SIZE_PX));
    }
    if (cap >= total) break;
    rows++;
  }

  const seats: PlacedSeat[] = [];
  let idx = 0;

  for (let row = 0; row < rows && idx < total; row++) {
    const radius = MIN_RADIUS + row * ROW_SPACING;
    const arcLen = radius * spanRad;
    const capacity = Math.max(1, Math.floor(arcLen / SEAT_SIZE_PX));
    const remaining = total - idx;
    const count = Math.min(capacity, remaining);
    if (count <= 0) break;

    // Spread seats evenly across the arc with slight padding
    const padDeg = count > 1 ? 2 : 0;
    const usableSpan = spanDeg - padDeg * 2;
    const stepDeg = count > 1 ? usableSpan / (count - 1) : 0;
    const startDeg = startAngleDeg + padDeg;

    for (let j = 0; j < count && idx < total; j++) {
      const angleDeg = startDeg + stepDeg * j;
      const angleRad = (angleDeg * Math.PI) / 180;
      const x = SPEAKER_X + radius * Math.sin(angleRad);
      const y = SPEAKER_Y - radius * Math.cos(angleRad);

      const member = members[idx];
      const party = parties.find((p) => p.id === member.partyId);
      if (!party) {
        idx++;
        continue;
      }

      seats.push({
        member,
        party,
        xPct: (x / VW) * 100,
        yPct: (y / VH) * 100,
      });
      idx++;
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

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      setScale(Math.min(1, w / 900));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { governmentSeats, oppositionSeats } = useMemo(() => {
    const govParties = session.parties.filter((p) => p.isGovernment);
    const oppParties = session.parties.filter((p) => !p.isGovernment);

    const govMembers = session.members
      .filter((m) => govParties.some((p) => p.id === m.partyId))
      .sort((a, b) => a.partyId.localeCompare(b.partyId) || a.name.localeCompare(b.name));

    const oppMembers = session.members
      .filter((m) => oppParties.some((p) => p.id === m.partyId))
      .sort((a, b) => a.partyId.localeCompare(b.partyId) || a.name.localeCompare(b.name));

    return {
      governmentSeats: distributeSide(govMembers, session.parties, 12, 82),
      oppositionSeats: distributeSide(oppMembers, session.parties, -82, -12),
    };
  }, [session]);

  const allSeats = useMemo(
    () => [...oppositionSeats, ...governmentSeats],
    [governmentSeats, oppositionSeats]
  );

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className="relative mx-auto overflow-hidden rounded-t-[200px] border-x-8 border-t-0 border-wood shadow-2xl bg-gradient-to-b from-commons-dark via-commons-green to-commons-dark"
        style={{
          width: "100%",
          maxWidth: `${900 * scale}px`,
          aspectRatio: `${VW} / ${VH}`,
        }}
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Ambient light sweep */}
        <div className="absolute inset-0 pointer-events-none opacity-15 bg-gradient-to-tr from-transparent via-gold/10 to-transparent animate-spotlight" />

        {/* Gothic window backdrop */}
        <div className="absolute inset-0 flex items-start justify-center pt-8 opacity-[0.05] pointer-events-none">
          <div className="w-[40%] h-[50%] gothic-window bg-gold-pale" />
        </div>

        {/* Wood floor */}
        <div className="absolute bottom-0 left-0 right-0 h-[12%] bg-gradient-to-t from-wood-dark/80 to-transparent pointer-events-none" />

        {/* Central aisle line */}
        <div className="absolute left-1/2 top-[15%] bottom-[12%] w-px bg-gold/10 pointer-events-none" />

        {/* Dispatch box */}
        <div
          className="absolute z-10"
          style={{
            left: "50%",
            top: "62%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="flex items-center gap-6">
            {/* Opposition dispatch box */}
            <div className="w-12 h-8 bg-wood border border-gold-dark rounded-sm shadow-lg" />
            {/* Mace in center */}
            <Mace className="h-12 w-auto opacity-80" />
            {/* Government dispatch box */}
            <div className="w-12 h-8 bg-wood border border-gold-dark rounded-sm shadow-lg" />
          </div>
        </div>

        {/* Speaker chair */}
        <div
          className="absolute z-20"
          style={{
            left: "50%",
            bottom: "2%",
            transform: "translateX(-50%)",
          }}
        >
          <div className="flex flex-col items-center">
            <div className="w-20 h-16 bg-wood border-2 border-gold-dark rounded-t-lg shadow-2xl flex items-center justify-center relative">
              <div className="absolute top-1 w-14 h-3 bg-gold/20 rounded-sm" />
              <span
                className="font-inscription text-gold-pale tracking-[0.15em] uppercase text-center"
                style={{ fontSize: `${8 * Math.max(scale, 0.7)}px` }}
              >
                Speaker
              </span>
            </div>
            <div className="w-24 h-2 bg-wood-dark border-y border-gold-dark/40 rounded-full" />
          </div>
        </div>

        {/* Seats */}
        {allSeats.map((seat, index) => {
          const isActive = activeMemberId === seat.member.id;
          const isSpeaking = speakingMemberId === seat.member.id;
          return (
            <motion.button
              key={seat.member.id}
              type="button"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: Math.min(index * 0.006, 1.5),
                duration: 0.3,
                type: "spring",
                stiffness: 200,
                damping: 12,
              }}
              className={[
                "absolute rounded-full border-2 transition-all duration-200",
                isActive ? "ring-2 ring-gold z-30 scale-125" : "z-10",
                isSpeaking ? "z-40" : "",
                onMemberClick ? "cursor-pointer hover:scale-125 hover:brightness-125" : "",
                seat.member.isPresent ? "" : "opacity-40 grayscale",
              ].join(" ")}
              style={{
                left: `${seat.xPct}%`,
                top: `${seat.yPct}%`,
                width: `${SEAT_SIZE_PX}px`,
                height: `${SEAT_SIZE_PX}px`,
                transform: "translate(-50%, -50%)",
                borderColor: seat.party.color,
                backgroundColor: seat.party.color + "30",
                boxShadow: isSpeaking
                  ? "0 0 16px rgba(230,200,110,0.8)"
                  : isActive
                  ? "0 0 8px rgba(200,161,58,0.5)"
                  : "none",
              }}
              onClick={() => onMemberClick?.(seat.member)}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltip({
                  member: seat.member,
                  party: seat.party,
                  x: rect.left + rect.width / 2,
                  y: rect.top,
                });
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltip({
                  member: seat.member,
                  party: seat.party,
                  x: rect.left + rect.width / 2,
                  y: rect.top,
                });
              }}
              onMouseLeave={() => setTooltip(null)}
              title={`${seat.member.name} (${seat.party.abbreviation})`}
            >
              <img
                src={seat.member.avatar}
                alt={seat.member.name}
                className="w-full h-full object-cover rounded-full"
                loading="lazy"
              />
              {isSpeaking && (
                <span className="absolute inset-0 rounded-full border-2 border-gold-light animate-ping opacity-50" />
              )}
            </motion.button>
          );
        })}

        {/* Side labels */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute right-4 top-4 text-gold-pale/40 font-inscription tracking-[0.2em] uppercase rotate-12 pointer-events-none"
          style={{ fontSize: `${10 * Math.max(scale, 0.7)}px` }}
        >
          Government
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute left-4 top-4 text-gold-pale/40 font-inscription tracking-[0.2em] uppercase -rotate-12 pointer-events-none"
          style={{ fontSize: `${10 * Math.max(scale, 0.7)}px` }}
        >
          Opposition
        </motion.div>

        {/* Legend */}
        <div className="absolute bottom-2 right-2 flex flex-wrap gap-1.5 max-w-[200px] pointer-events-none">
          {session.parties.map((p) => (
            <div key={p.id} className="flex items-center gap-1">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              <span className="font-inscription text-[8px] text-parchment/60 uppercase">
                {p.abbreviation}
              </span>
            </div>
          ))}
        </div>
      </div>

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
