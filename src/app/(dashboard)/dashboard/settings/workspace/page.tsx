import { OrganizationProfile } from "@clerk/nextjs";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";

export default function WorkspaceSettingsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Workspace Settings"
        description="Manage your organization profile, rename settings, or delete the active tenant."
      />
      <div className="mt-6 flex justify-start">
        <OrganizationProfile
          routing="hash"
          appearance={{
            variables: {
              colorPrimary: "oklch(0.65 0.22 142)",
              colorBackground: "oklch(0.18 0.015 250)",
              colorForeground: "oklch(0.985 0 0)",
              colorInput: "oklch(0.145 0 0)",
              colorInputForeground: "oklch(0.985 0 0)",
              colorBorder: "oklch(1 0 0 / 8%)",
            },
            elements: {
              card: "border border-white/[0.05] bg-card/65 backdrop-blur-xl shadow-2xl rounded-xl w-full",
              headerTitle: "text-foreground font-bold font-sans",
              headerSubtitle: "text-muted-foreground font-sans text-xs",
              formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/80 transition-colors h-8 text-sm rounded-lg",
              formFieldLabel: "text-muted-foreground font-medium text-xs",
              navbar: "border-r border-white/[0.05] pr-6",
            },
          }}
        />
      </div>
    </PageContainer>
  );
}
