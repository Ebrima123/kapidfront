import {
  Brush,
  Building2,
  Hammer,
  Home,
  Layers,
  Paintbrush,
  PaintRoller,
  Palette,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/** Icon names editors can type into a service's "icon" field. */
export const SERVICE_ICONS: Record<string, LucideIcon> = {
  brush: Brush,
  paintbrush: Paintbrush,
  roller: PaintRoller,
  home: Home,
  building: Building2,
  layers: Layers,
  sparkles: Sparkles,
  wrench: Wrench,
  hammer: Hammer,
  palette: Palette,
};

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = SERVICE_ICONS[name] ?? PaintRoller;
  return <Icon className={className} aria-hidden />;
}
