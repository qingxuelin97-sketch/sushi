import type { Member, Party } from "@/types";
import MemberAvatar from "./MemberAvatar";

interface SeatProps {
  member: Member;
  party: Party;
  angle: number;
  radius: number;
  isActive?: boolean;
  isSpeaking?: boolean;
  onClick?: () => void;
}

export default function Seat({
  member,
  party,
  angle,
  radius,
  isActive,
  isSpeaking,
  onClick,
}: SeatProps) {
  const radians = (angle * Math.PI) / 180;
  const x = Math.cos(radians) * radius;
  const y = Math.sin(radians) * radius;

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
      }}
    >
      <MemberAvatar
        member={member}
        party={party}
        size="sm"
        isActive={isActive}
        isSpeaking={isSpeaking}
        onClick={onClick}
      />
    </div>
  );
}
