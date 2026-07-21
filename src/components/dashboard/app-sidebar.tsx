"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarRangeIcon,
  GamepadIcon,
  LayoutDashboardIcon,
  TicketIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ResetDemoButton } from "@/components/dashboard/reset-demo-button";

const NAV = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboardIcon },
  { title: "Slots", url: "/dashboard/slots", icon: CalendarRangeIcon },
  { title: "Bookings", url: "/dashboard/bookings", icon: TicketIcon },
  { title: "Games", url: "/dashboard/games", icon: GamepadIcon },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/dashboard" />}>
              {/* Sidebar-scoped tokens: the global primary/muted would be
                  near-invisible against the navy sidebar surface. */}
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <span className="text-sm font-semibold">KR</span>
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-semibold">KR Funverse</span>
                <span className="truncate text-xs text-sidebar-foreground/70">
                  Booking admin
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarMenu>
            {NAV.map((item) => {
              const Icon = item.icon;
              // Exact match for the index route, prefix match for the rest, so
              // /dashboard doesn't stay highlighted on every child page.
              const isActive =
                item.url === "/dashboard"
                  ? pathname === item.url
                  : pathname.startsWith(item.url);
              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    isActive={isActive}
                    tooltip={item.title}
                    render={<Link href={item.url} />}
                  >
                    <Icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <ResetDemoButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
