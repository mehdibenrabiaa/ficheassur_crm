"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ChevronRightIcon } from "lucide-react"

export function NavMain({
  label,
  items,
}: {
  label: string
  items: {
    title: string
    url: string
    icon?: React.ReactNode
    isActive?: boolean
    // A count shown at the item's right edge (e.g. broken links); hidden when 0.
    badge?: number
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname()
  // On phones the sidebar is a slide-over panel: following a link (even to
  // the page already open) should close it, not leave it covering the page.
  const { isMobile, setOpenMobile } = useSidebar()
  const closeOnMobile = () => { if (isMobile) setOpenMobile(false) }
  // The dashboard home only matches itself; other items also match their sub-pages
  // (e.g. a lead's page keeps "Leads" highlighted).
  const isCurrent = (url: string) =>
    pathname === url || (url !== "/dashboard" && pathname.startsWith(`${url}/`))

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) =>
          item.items?.length ? (
            <Collapsible
              key={item.title}
              defaultOpen={item.isActive}
              className="group/collapsible"
              render={<SidebarMenuItem />}
            >
              <CollapsibleTrigger
                render={<SidebarMenuButton tooltip={item.title} />}
              >
                {item.icon}
                <span>{item.title}</span>
                <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton render={<Link href={subItem.url} onClick={closeOnMobile} />}>
                        <span>{subItem.title}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} isActive={isCurrent(item.url)} render={<Link href={item.url} onClick={closeOnMobile} />}>
                {item.icon}
                <span>{item.title}</span>
              </SidebarMenuButton>
              {item.badge ? (
                <SidebarMenuBadge className="bg-destructive text-white peer-hover/menu-button:text-white peer-data-active/menu-button:text-white">
                  {item.badge}
                </SidebarMenuBadge>
              ) : null}
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
