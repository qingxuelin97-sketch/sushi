import { useState } from "react";
import { Crown, AlertCircle } from "lucide-react";
import { useSessionStore } from "@/store/sessionStore";
import PageHeader from "@/components/PageHeader";
import MemberAvatar from "@/components/MemberAvatar";

export default function Members() {
  const session = useSessionStore((s) => s.session);
  const updateMember = useSessionStore((s) => s.updateMember);
  const [selectedParty, setSelectedParty] = useState<string | "all">("all");

  if (!session) {
    return (
      <div className="text-center py-20">
        <p className="font-body text-xl text-ink-muted">尚未创建议会会话</p>
      </div>
    );
  }

  const filteredMembers =
    selectedParty === "all"
      ? session.members
      : session.members.filter((m) => m.partyId === selectedParty);

  return (
    <div>
      <PageHeader title="政党与议员" subtitle="Parties & Members" ornament="Members" />

      {/* Parties overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {session.parties.map((party) => (
          <div
            key={party.id}
            onClick={() => setSelectedParty(party.id)}
            className={[
              "card-parchment p-4 cursor-pointer transition-all",
              selectedParty === party.id ? "ring-2 ring-gold" : "hover:shadow-lg",
            ].join(" ")}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full border border-ink/20"
                  style={{ backgroundColor: party.color }}
                />
                <div>
                  <div className="font-display font-bold">{party.name}</div>
                  <div className="font-inscription text-[10px] text-ink-muted tracking-wider uppercase">
                    {party.abbreviation}
                  </div>
                </div>
              </div>
              {party.isGovernment && (
                <span className="px-2 py-0.5 bg-gold/10 text-gold-dark text-[10px] font-inscription rounded-sm flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  执政党
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div className="bg-ink/5 rounded-sm p-2">
                <div className="font-mono font-bold">{party.seats}</div>
                <div className="font-inscription text-[10px] text-ink-muted">席位</div>
              </div>
              <div className="bg-ink/5 rounded-sm p-2">
                <div className="font-mono font-bold">{party.whipStrength}</div>
                <div className="font-inscription text-[10px] text-ink-muted">党鞭</div>
              </div>
              <div className="bg-ink/5 rounded-sm p-2">
                <div className="font-mono font-bold">
                  {session.members.filter((m) => m.partyId === party.id && m.isPresent).length}
                </div>
                <div className="font-inscription text-[10px] text-ink-muted">出席</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={() => setSelectedParty("all")}
          className={[
            "px-3 py-1.5 rounded-sm font-inscription text-xs tracking-wider uppercase transition-colors",
            selectedParty === "all"
              ? "bg-commons-green text-parchment"
              : "bg-ink/5 text-ink/70 hover:bg-ink/10",
          ].join(" ")}
        >
          全部
        </button>
        {session.parties.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelectedParty(p.id)}
            className={[
              "px-3 py-1.5 rounded-sm font-inscription text-xs tracking-wider uppercase transition-colors flex items-center gap-2",
              selectedParty === p.id
                ? "bg-commons-green text-parchment"
                : "bg-ink/5 text-ink/70 hover:bg-ink/10",
            ].join(" ")}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: p.color }}
            />
            {p.abbreviation}
          </button>
        ))}
      </div>

      {/* Members grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => {
          const party = session.parties.find((p) => p.id === member.partyId);
          return (
            <div key={member.id} className="card-parchment p-4">
              <div className="flex items-start gap-3">
                <MemberAvatar member={member} party={party} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold truncate">{member.name}</div>
                  <div className="font-body text-sm text-ink-muted truncate">
                    {party?.abbreviation} · {member.constituency}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {member.traits.slice(0, 2).map((trait) => (
                      <span
                        key={trait}
                        className="px-1.5 py-0.5 bg-gold/10 text-gold-dark text-[10px] font-inscription rounded-sm"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-ink/10 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-body cursor-pointer">
                  <input
                    type="checkbox"
                    checked={member.isPresent}
                    onChange={(e) =>
                      updateMember(member.id, { isPresent: e.target.checked })
                    }
                    className="accent-commons-green"
                  />
                  出席
                </label>
                <button
                  type="button"
                  onClick={() =>
                    updateMember(member.id, { isRebel: !member.isRebel })
                  }
                  className={[
                    "text-[10px] font-inscription px-2 py-1 rounded-sm transition-colors",
                    member.isRebel
                      ? "bg-lords-red text-parchment"
                      : "bg-ink/5 text-ink-muted hover:bg-ink/10",
                  ].join(" ")}
                >
                  {member.isRebel ? "反叛中" : "标记反叛"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12 text-ink-muted">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p className="font-body">该政党暂无议员</p>
        </div>
      )}
    </div>
  );
}
