import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <SignIn
      path="/login"
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
          card: "border border-white/[0.05] bg-card/65 backdrop-blur-xl shadow-2xl rounded-xl",
          headerTitle: "text-foreground font-bold font-sans",
          headerSubtitle: "text-muted-foreground font-sans text-xs",
          socialButtonsBlockButton: "border border-white/[0.05] bg-secondary/50 text-foreground hover:bg-secondary transition-colors",
          formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/80 transition-colors h-8 text-sm rounded-lg",
          footerActionText: "text-muted-foreground text-xs",
          footerActionLink: "text-primary hover:underline font-semibold",
          formFieldLabel: "text-muted-foreground font-medium text-xs",
          identityPreviewText: "text-foreground",
          identityPreviewEditButton: "text-primary hover:underline",
          formResendCodeLink: "text-primary hover:underline",
          dividerText: "text-muted-foreground text-xs",
        },
      }}
    />
  );
}
