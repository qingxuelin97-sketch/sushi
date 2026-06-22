import type { Member, Party } from "@/types";

interface MemberAvatarProps {
  member: Member;
  party?: Party;
  size?: "sm" | "md" | "lg";
  isActive?: boolean;
  isSpeaking?: boolean;
  onClick?: () => void;
}

const sizeMap = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
};

export default function MemberAvatar({
  member,
  party,
  size = "md",
  isActive = false,
  isSpeaking = false,
  onClick,
}: MemberAvatarProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative rounded-full overflow-hidden border-2 transition-all duration-200",
        sizeMap[size],
        isActive ? "ring-2 ring-gold ring-offset-2 ring-offset-parchment scale-110" : "",
        isSpeaking ? "shadow-glow animate-pulse" : "",
        onClick ? "cursor-pointer hover:scale-105" : "",
        member.isPresent ? "" : "opacity-40 grayscale",
      ].join(" ")}
      style={{ borderColor: party?.color || "#9CA3AF" }}
      title={`${member.name} (${party?.abbreviation || "Ind"})`}
    >
      <img
        src={member.avatar}
        alt={member.name}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {isSpeaking && (
        <span className="absolute inset-0 rounded-full border-2 border-gold-light animate-ping opacity-60" />
      )}
    </button>
  );
}
