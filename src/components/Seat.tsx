import { motion } from "framer-motion";
import type { Member, Party } from "@/types";
import MemberAvatar from "./MemberAvatar";

interface SeatProps {
  member: Member;
  party: Party;
  angle: number;
  radius: number;
  index: number;
  isActive?: boolean;
  isSpeaking?: boolean;
  onClick?: () => void;
  onHover?: (member: Member, party: Party, x: number, y: number) => void;
  onLeave?: () => void;
}

export default function Seat({
  member,
  party,
  angle,
  radius,
  index,
  isActive,
  isSpeaking,
  onClick,
  onHover,
  onLeave,
}: SeatProps) {
  const radians = (angle * Math.PI) / 180;
  const x = Math.sin(radians) * radius;
  const y = -Math.cos(radians) * radius;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.008,
        duration: 0.35,
        type: "spring",
        stiffness: 260,
        damping: 15,
      }}
      className="absolute transform -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `calc(50% + ${x}px)`,
        top: `calc(100% + ${y}px)`,
      }}
      onMouseEnter={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        onHover?.(member, party, rect.left + rect.width / 2, rect.top + rect.height / 2);
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        onHover?.(member, party, rect.left + rect.width / 2, rect.top + rect.height / 2);
      }}
      onMouseLeave={onLeave}
    >
      <MemberAvatar
        member={member}
        party={party}
        size="sm"
        isActive={isActive}
        isSpeaking={isSpeaking}
        onClick={onClick}
      />
    </motion.div>
  );
}
