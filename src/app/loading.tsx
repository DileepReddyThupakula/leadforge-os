export default function GlobalLoading() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-4">
        {/* Animated glowing spinner */}
        <div className="relative flex h-10 w-10 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-2 border-t-primary animate-spin" />
        </div>
        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase animate-pulse">
          Loading LeadForge OS
        </p>
      </div>
    </div>
  );
}
