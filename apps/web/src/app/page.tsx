"use client";

import Link from "next/link";
import { Sparkles, Zap, Shield, Workflow, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <header className="border-b border-border/50 backdrop-blur-xl sticky top-0 z-50 bg-background/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold">Synapse</span>
          </div>
          <div className="flex items-center gap-5">
            <LanguageSwitcher />
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition whitespace-nowrap">
              {t.common.signIn}
            </Link>
            <Link
              href="/register"
              className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition whitespace-nowrap"
            >
              {t.common.getStarted}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-6 py-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-sm mb-8">
            <Sparkles className="w-4 h-4" />
            {t.landing.badge}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6">
            {t.landing.heroTitle1}
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              {t.landing.heroTitle2}
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            {t.landing.heroDesc}
          </p>
          <div className="flex items-center gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-base font-medium hover:bg-primary/90 transition"
            >
              {t.landing.startBuilding} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-lg text-base font-medium hover:bg-accent transition"
            >
              {t.common.signIn}
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-6 pb-32">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Sparkles,
                title: t.landing.featureAI,
                desc: t.landing.featureAIDesc,
                color: "text-purple-400",
                bg: "bg-purple-500/10",
              },
              {
                icon: Workflow,
                title: t.landing.featureEditor,
                desc: t.landing.featureEditorDesc,
                color: "text-sky-400",
                bg: "bg-sky-500/10",
              },
              {
                icon: Shield,
                title: t.landing.featureSecurity,
                desc: t.landing.featureSecurityDesc,
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="glass rounded-xl p-6 hover:border-border/60 transition group"
              >
                <div className={`w-10 h-10 rounded-lg ${f.bg} flex items-center justify-center mb-4`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 text-center text-xs text-muted-foreground">
        {t.landing.footer}
      </footer>
    </div>
  );
}
