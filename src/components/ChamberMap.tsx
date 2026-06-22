import { useMemo } from "react";
import type { Session, Member, Party } from "@/types";
import Seat from "./Seat";

interface ChamberMapProps {
  session: Session;
  activeMemberId?: string;
  speakingMemberId?: string;
  onMemberClick?: (member: Member) => void;
}

export default function ChamberMap({
  session,
  activeMemberId,
  speakingMemberId,
  onMemberClick,
}: ChamberMapProps) {
  const seatLayout = useMemo(() => {
    const governmentParties = session.parties.filter((p) => p.isGovernment);
    const oppositionParties = session.parties.filter((p) => !p.isGovernment);

    const seats: { member: Member; party: Party; angle: number; radius: number }[] = [];

    // Government side: right arc (0 to 80 degrees)
    const govMembers = session.members.filter((m) =>
      governmentParties.some((p) => p.id === m.partyId)
    );
    const oppMembers = session.members.filter((m) =>
      oppositionParties.some((p) => p.id === m.partyId)
    );

    const distribute = (
      members: Member[],
      startAngle: number,
      endAngle: number,
      radius: number
    ) => {
      const count = members.length;
      if (count === 0) return;
      const step = (endAngle - startAngle) / Math.max(count - 1, 1);
      members.forEach((member, i) => {
        const party = session.parties.find((p) => p.id === member.partyId)!;
        seats.push({
          member,
          party,
          angle: startAngle + step * i,
          radius,
        });
      });
    };

    // Outer arcs
    distribute(govMembers, 10, 80, 220);
    distribute(oppMembers, 100, 170, 220);

    return seats;
  }, [session]);

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-b from-commons-dark to-commons-green rounded-t-[50%] border-8 border-wood shadow-depth overflow-hidden">
      {/* Gothic window backdrop */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <div className="w-[80%] h-[80%] gothic-window bg-ink" />
      </div>

      {/* Speaker chair */}
      <div className="absolute left-1/2 bottom-4 -translate-x-1/2 flex flex-col items-center">
        <div className="w-24 h-28 bg-wood border-4 border-gold-dark rounded-t-lg shadow-lg flex items-center justify-center">
          <span className="font-inscription text-gold-pale text-xs tracking-widest text-center">
            SPEAKER
          </span>
        </div>
        <div className="w-32 h-3 bg-gold-dark rounded-full mt-1" />
      </div>

      {/* Dispatch box / dispatch box */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-12 bg-wood border-2 border-gold-dark rounded-sm shadow-lg" />

      {/* Seats */}
      {seatLayout.map(({ member, party, angle, radius }) => (
        <Seat
          key={member.id}
          member={member}
          party={party}
          angle={angle}
          radius={radius}
          isActive={activeMemberId === member.id}
          isSpeaking={speakingMemberId === member.id}
          onClick={() => onMemberClick?.(member)}
        />
      ))}

      {/* Government label */}
      <div className="absolute right-8 top-8 text-gold-pale/60 font-inscription text-xs tracking-widest uppercase rotate-12">
        Government
      </div>
      <div className="absolute left-8 top-8 text-gold-pale/60 font-inscription text-xs tracking-widest uppercase -rotate-12">
        Opposition
      </div>
    </div>
  );
}
