"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

/** Sun · switch · moon, sized for the page header. */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // resolvedTheme is unknown during SSR, so hold a neutral state until mount
  // rather than guessing and flipping on hydration.
  React.useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className="flex items-center gap-2">
      <SunIcon
        className={cn(
          "size-4 transition-colors",
          isDark ? "text-muted-foreground" : "text-status-due"
        )}
      />
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label="Toggle dark mode"
      />
      <MoonIcon
        className={cn(
          "size-4 transition-colors",
          isDark ? "text-chart-1" : "text-muted-foreground"
        )}
      />
    </div>
  );
}
