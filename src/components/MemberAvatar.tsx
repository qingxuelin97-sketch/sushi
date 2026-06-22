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
  sm: "w-7 h-7",
  md: "w-11 h-11",
  lg: "w-14 h-14",
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
        isActive ? "ring-2 ring-gold scale-110 z-10" : "",
        isSpeaking ? "shadow-[0_0_18px_rgba(230,200,110,0.65)] animate-pulse z-20" : "",
        onClick ? "cursor-pointer hover:scale-110 hover:brightness-110" : "",
        member.isPresent ? "" : "opacity-45 grayscale",
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
        <span className="absolute inset-0 rounded-full border-2 border-gold-light animate-ping opacity-50" />
      )}
      {!member.isPresent && (
        <span className="absolute inset-0 flex items-center justify-center bg-ink/30">
          <span className="w-1.5 h-1.5 rounded-full bg-ink/60" />
        </span>
      )}
    </button>
  );
}
