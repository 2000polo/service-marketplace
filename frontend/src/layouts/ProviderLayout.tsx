import { Link, Outlet } from "react-router";
import { LayoutDashboard, CalendarDays, BriefcaseBusiness } from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    href: "/provider",
    icon: LayoutDashboard,
  },
  {
    label: "Services",
    href: "/provider/services",
    icon: BriefcaseBusiness,
  },
  {
    label: "Bookings",
    href: "/provider/bookings",
    icon: CalendarDays,
  },
];

export default function ProviderLayout() {
  return (
    <div className="min-h-screen bg-[#0b1019] text-white">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/10 p-4">
          <div className="mb-8 px-3 text-xl font-semibold">
            ServiceHub
          </div>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}