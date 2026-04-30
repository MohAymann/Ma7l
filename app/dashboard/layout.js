import DashboardSidebar from "@/components/ui/dashboardSidebar"

export default function DashboardLayout({ children }) {
    return (
        <div dir="rtl" className="flex flex-1 flex-col md:flex-row">
            <DashboardSidebar />
            <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
    )
}
