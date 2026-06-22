import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Gavel,
  Users,
  ScrollText,
  FileText,
  Scale,
  Newspaper,
  BarChart3,
  BookOpen,
  Home,
} from "lucide-react";
import { useSessionStore } from "@/store/sessionStore";
import Crest from "./Crest";

const navItems = [
  { path: "/", label: "序厅", icon: Home },
  { path: "/chamber", label: "议事厅", icon: Gavel },
  { path: "/members", label: "议员", icon: Users },
  { path: "/agenda", label: "议程", icon: ScrollText },
  { path: "/division", label: "表决", icon: Scale },
  { path: "/hansard", label: "议事录", icon: FileText },
  { path: "/events", label: "事件", icon: Newspaper },
  { path: "/analytics", label: "统计", icon: BarChart3 },
  { path: "/rules", label: "规则", icon: BookOpen },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const session = useSessionStore((s) => s.session);

  return (
    <div className="min-h-screen bg-parchment text-ink font-body relative">
      <div className="grain-overlay" />
      <div className="vignette" />

      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-commons-green border-b-4 border-gold-dark shadow-depth">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <Crest className="h-10 w-auto drop-shadow-md group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <span className="font-display text-parchment text-lg font-bold tracking-wide leading-none">
                议会模拟器
              </span>
              <span className="font-inscription text-gold-pale text-[10px] tracking-[0.2em] uppercase">
                Parliament Simulator
              </span>
            </div>
          </Link>

          {session && (
            <div className="hidden md:flex items-center gap-6 text-parchment/90">
              <div className="flex flex-col items-end">
                <span className="font-inscription text-xs tracking-widest text-gold-pale">
                  {session.year}
                </span>
                <span className="font-body text-sm truncate max-w-[200px]">
                  {session.name}
                </span>
              </div>
              <div className="h-8 w-px bg-gold-dark/50" />
              <div className="flex flex-col items-end">
                <span className="font-inscription text-xs tracking-widest text-gold-pale">
                  议长
                </span>
                <span className="font-body text-sm">{session.speaker.name}</span>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="flex">
        {/* Sidebar navigation */}
        <nav className="hidden lg:block w-64 sticky top-16 h-[calc(100vh-4rem)] bg-parchment-dark/30 border-r border-ink/10 overflow-y-auto">
          <div className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={[
                    "flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-200",
                    "font-inscription text-sm tracking-wider uppercase",
                    active
                      ? "bg-commons-green text-parchment shadow-md"
                      : "text-ink/70 hover:bg-ink/5 hover:text-ink",
                  ].join(" ")}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {session && (
            <div className="mt-6 mx-4 p-4 card-parchment">
              <h4 className="font-inscription text-xs text-ink-muted tracking-widest uppercase mb-2">
                当前议程
              </h4>
              <p className="font-display text-sm font-semibold line-clamp-2">
                {session.motions.find((m) => m.id === session.motions[session.motions.length - 1]?.id)
                  ?.title || "暂无议题"}
              </p>
            </div>
          )}
        </nav>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-commons-green border-t-4 border-gold-dark px-2 pb-safe">
          <div className="flex justify-around overflow-x-auto">
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={[
                    "flex flex-col items-center gap-1 px-3 py-2 min-w-[64px]",
                    active ? "text-gold-light" : "text-parchment/70",
                  ].join(" ")}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-inscription tracking-wide">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Main content */}
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 min-h-[calc(100vh-4rem)] p-4 lg:p-8 pb-24 lg:pb-8"
        >
          <div className="max-w-7xl mx-auto">{children}</div>
        </motion.main>
      </div>
    </div>
  );
}
