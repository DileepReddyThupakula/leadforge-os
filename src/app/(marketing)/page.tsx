import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/shared/GlassCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { Section } from "@/components/layout/Section";
import { Icon } from "@/components/shared/Icon";

export default function MarketingHomePage() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]" aria-hidden="true">
        <div
          className="relative left-1/2 -z-10 aspect-1155/678 w-[36rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-[#793ef5] opacity-20 sm:w-[72rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <PageContainer className="pb-24 pt-20 sm:pb-32 lg:pt-32">
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary font-medium">
            <Icon name="Globe" className="size-3.5" />
            <span>Now in open beta for fast-growing sales teams</span>
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl leading-[1.15]">
            The B2B Sales Operating System for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#6ee7b7] to-[#8b5cf6]">Hyper-Growth</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unify real-time lead ingestion, multi-vendor enrichment, and sequence-based automated outreach into a single, cohesive operating center.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row pt-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto font-semibold">
                Get Started Free
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto font-semibold border-white/[0.08] hover:bg-white/[0.04]">
                Book a Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Core Value Proposition Cards */}
        <Section title="Engineered for Sales Velocity" description="Consolidate your stack. Eliminate multiple monthly subscriptions and build higher quality pipelines." className="mt-24 sm:mt-32">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <GlassCard hoverEffect className="space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon name="Users" className="size-5" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Real-time Lead Ingestion</h3>
              <p className="text-sm text-muted-foreground">
                Hook up custom webhooks, segment, or database triggers. Pull raw contacts instantly from multiple traffic networks without latency.
              </p>
            </GlassCard>

            <GlassCard hoverEffect className="space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon name="Cpu" className="size-5" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Multi-Vendor Enrichment</h3>
              <p className="text-sm text-muted-foreground">
                Automatically route emails to Clearbit, Hunter, and custom scraps sequentially. Resolve valid data points with confidence scoring.
              </p>
            </GlassCard>

            <GlassCard hoverEffect className="space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon name="Mail" className="size-5" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Sequenced Outreach</h3>
              <p className="text-sm text-muted-foreground">
                Trigger transactional warmups and cold mail sequences straight from the leads tables, fully synchronized with dynamic status metrics.
              </p>
            </GlassCard>
          </div>
        </Section>
      </PageContainer>
    </div>
  );
}
