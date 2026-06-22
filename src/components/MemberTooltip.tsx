import { motion, AnimatePresence } from "framer-motion";
import type { Member, Party } from "@/types";
import MemberAvatar from "./MemberAvatar";

interface MemberTooltipProps {
  member: Member;
  party?: Party;
  x: number;
  y: number;
}

export default function MemberTooltip({ member, party, x, y }: MemberTooltipProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.15 }}
        className="fixed z-[100] pointer-events-none"
        style={{ left: x + 12, top: y - 12 }}
      >
        <div className="bg-parchment-light border border-gold-dark/40 rounded-sm shadow-depth p-3 min-w-[180px]">
          <div className="flex items-center gap-3 mb-2">
            <MemberAvatar member={member} party={party} size="md" />
            <div>
              <div className="font-display font-bold text-sm leading-tight">{member.name}</div>
              <div className="font-body text-xs text-ink-muted">{member.constituency}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: party?.color || "#9CA3AF" }}
            />
            <span className="font-inscription text-[10px] uppercase tracking-wider text-ink-muted">
              {party?.name || "独立议员"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-ink/5 rounded-sm px-2 py-1">
              <span className="font-inscription text-[9px] text-ink-muted uppercase">口才</span>
              <span className="font-mono ml-1">{member.eloquence}</span>
            </div>
            <div className="bg-ink/5 rounded-sm px-2 py-1">
              <span className="font-inscription text-[9px] text-ink-muted uppercase">忠诚</span>
              <span className="font-mono ml-1">{member.loyalty}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {member.traits.slice(0, 3).map((trait) => (
              <span
                key={trait}
                className="px-1.5 py-0.5 bg-gold/10 text-gold-dark text-[9px] font-inscription rounded-sm"
              >
                {trait}
              </span>
            ))}
          </div>
          {!member.isPresent && (
            <div className="mt-2 text-[10px] font-inscription text-lords-red uppercase tracking-wider">
              缺席
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
