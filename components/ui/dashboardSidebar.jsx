"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import {
    AlertTriangle,
    LayoutDashboard,
    LogOut,
    Menu,
    Package,
    Settings,
    Store,
    Tag,
} from "lucide-react"

import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"

const sections = [
    {
        label: "العام",
        items: [
            { href: "/dashboard", label: "الرئيسية", icon: LayoutDashboard },
            { href: "/dashboard/products", label: "المنتجات", icon: Package },
        ],
    },
    {
        label: "المخزن",
        items: [
            { href: "/dashboard/low-stock", label: "النواقص", icon: AlertTriangle },
            { href: "/dashboard/categories", label: "التصنيفات", icon: Tag },
        ],
    },
]

function NavItem({ href, label, icon: Icon, active, onSelect }) {
    return (
        <Link
            href={href}
            onClick={onSelect}
            className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                active
                    ? "bg-primary text-foreground"
                    : "text-foreground/80 hover:bg-sidebar-accent hover:text-foreground"
            )}
        >
            <Icon className="h-4 w-4" />
            {label}
        </Link>
    )
}

function SidebarBody({ user, loading, pathname, onSelect, onLogout }) {
    return (
        <div className="flex h-full flex-col text-foreground">
            <div className="flex items-center gap-3 border-b border-border p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                    <Store className="h-5 w-5" />
                </div>
                <div className="flex min-w-0 flex-col">
                    <span className="text-xs text-foreground/60">المتجر</span>
                    {loading ? (
                        <Skeleton className="h-4 w-24" />
                    ) : (
                        <span className="truncate font-bold">{user?.store_name || "متجري"}</span>
                    )}
                </div>
            </div>

            <nav className="flex-1 space-y-4 overflow-y-auto p-3">
                {sections.map(section => (
                    <div key={section.label} className="space-y-1 border-b border-border">
                        <p className="px-3 text-xs font-medium text-foreground">
                            {section.label}
                        </p>
                        {section.items.map(item => (
                            <NavItem
                                key={item.href}
                                {...item}
                                active={pathname === item.href}
                                onSelect={onSelect}
                            />
                        ))}
                    </div>
                ))}
            </nav>

            <div className="space-y-1 border-t border-border p-3">
                <NavItem
                    href="/dashboard/settings"
                    label="الإعدادات"
                    icon={Settings}
                    active={pathname === "/dashboard/settings"}
                    onSelect={onSelect}
                />
                <button
                    type="button"
                    onClick={onLogout}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                >
                    <LogOut className="h-4 w-4" />
                    تسجيل الخروج
                </button>
            </div>
        </div>
    )
}

export default function DashboardSidebar() {
    const { user, loading } = useAuth()
    const pathname = usePathname()
    const router = useRouter()
    const [open, setOpen] = useState(false)

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" })
        } finally {
            setOpen(false)
            router.refresh()
            router.push("/authentication")
        }
    }

    return (
        <>
            <div className="flex items-center border-b border-border p-2 md:hidden" dir="rtl">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" aria-label="فتح القائمة">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        side="right"
                        dir="rtl"
                        showCloseButton={false}
                        className="w-72 bg-background p-0 text-sidebar-foreground sm:max-w-xs"
                    >
                        <SheetTitle className="sr-only">قائمة لوحة التحكم</SheetTitle>
                        <SidebarBody
                            user={user}
                            loading={loading}
                            pathname={pathname}
                            onSelect={() => setOpen(false)}
                            onLogout={handleLogout}
                        />
                    </SheetContent>
                </Sheet>
            </div>

            <aside
                dir="rtl"
                className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 border-l border-border bg-background md:block"
            >
                <SidebarBody
                    user={user}
                    loading={loading}
                    pathname={pathname}
                    onLogout={handleLogout}
                />
            </aside>
        </>
    )
}
