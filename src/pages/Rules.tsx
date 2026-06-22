import { useState } from "react";
import { Search, BookOpen } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { RULES } from "@/data/defaults";

export default function Rules() {
  const [query, setQuery] = useState("");

  const filteredRules = RULES.filter(
    (rule) =>
      rule.title.toLowerCase().includes(query.toLowerCase()) ||
      rule.content.toLowerCase().includes(query.toLowerCase()) ||
      rule.terms.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div>
      <PageHeader title="议事规则手册" subtitle="Erskine May" ornament="Standing Orders" />

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索议事规则、术语或示例..."
          className="w-full bg-parchment-light border border-ink/20 rounded-sm pl-10 pr-4 py-3 font-body text-ink focus:outline-none focus:border-gold-dark focus:ring-1 focus:ring-gold-dark"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredRules.map((rule) => (
          <div key={rule.id} className="card-parchment p-5">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-gold-dark mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-display font-bold text-lg mb-1">{rule.title}</h3>
                <p className="font-body text-ink/90 mb-3">{rule.content}</p>
                <div className="bg-ink/5 p-3 rounded-sm mb-3">
                  <div className="font-inscription text-[10px] uppercase tracking-wider text-ink-muted mb-1">
                    示例
                  </div>
                  <p className="font-body text-sm italic text-ink/80">{rule.example}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {rule.terms.map((term) => (
                    <span
                      key={term}
                      className="px-2 py-0.5 bg-gold/10 text-gold-dark text-[10px] font-inscription rounded-sm"
                    >
                      {term}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRules.length === 0 && (
        <div className="text-center py-12 text-ink-muted">
          <BookOpen className="w-10 h-10 mx-auto mb-2" />
          <p className="font-body">未找到匹配的议事规则</p>
        </div>
      )}
    </div>
  );
}
