import { Contact } from "@prisma/client";
import { GlassCard } from "@/components/shared/GlassCard";
import { Icon } from "@/components/shared/Icon";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ContactCardProps {
  contact: Contact;
}

export function ContactCard({ contact }: ContactCardProps) {
  const fullName = `${contact.firstName} ${contact.lastName}`;

  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center gap-3">
        <Avatar size="sm" className="h-10 w-10">
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
            {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-bold text-foreground text-sm">{fullName}</h4>
          <span className="text-xs text-muted-foreground">Primary Contact</span>
        </div>
      </div>
      <div className="space-y-2 text-sm pt-3 border-t border-white/[0.04] font-mono text-xs">
        {contact.email && (
          <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="Mail" className="size-4 shrink-0" />
            <a href={`mailto:${contact.email}`} className="truncate hover:underline">
              {contact.email}
            </a>
          </div>
        )}
        {contact.phone && (
          <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="Phone" className="size-4 shrink-0" />
            <a href={`tel:${contact.phone}`} className="truncate hover:underline">
              {contact.phone}
            </a>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
