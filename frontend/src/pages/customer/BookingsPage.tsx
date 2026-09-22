import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router";
import {
  CalendarDays,
  Clock,
  MapPin,
  UserRound,
  IndianRupee,
  ArrowRight,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock3,
  Sparkles,
  RefreshCw,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import toast from "react-hot-toast";

import { getBookings, type Booking } from "../../api/bookingApi";
import { useAuth } from "@/context/useAuth";

// Optional type helper if not in original import
const BookingsPage = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<string>("all");

    const { token } = useAuth();

  useEffect(() => {

    const fetchBookings = async () => {
        if(token){
            setIsLoading(true);
            try {
                const data = await getBookings(token);
                setBookings(data.bookings);
            } catch (error) {
                toast.error(
                    error instanceof Error ? error.message : "Failed to load bookings"
                );
            } finally {
                setIsLoading(false);
            }
        }
    };

    fetchBookings();
  }, [token]);

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  const formatTime = (date: string) => {
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(date));
  };

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "pending":
        return {
          label: "Pending",
          className: "bg-amber-500/10 text-amber-500 border-amber-500/20",
          icon: Clock3,
          dotColor: "bg-amber-500",
        };
      case "accepted":
        return {
          label: "Accepted",
          className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
          icon: Sparkles,
          dotColor: "bg-blue-500",
        };
      case "in_progress":
        return {
          label: "In Progress",
          className: "bg-purple-500/10 text-purple-400 border-purple-500/20",
          icon: RefreshCw,
          dotColor: "bg-purple-500 animate-pulse",
        };
      case "completed":
        return {
          label: "Completed",
          className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          icon: CheckCircle2,
          dotColor: "bg-emerald-500",
        };
      case "cancelled":
        return {
          label: "Cancelled",
          className: "bg-rose-500/10 text-rose-400 border-rose-500/20",
          icon: XCircle,
          dotColor: "bg-rose-500",
        };
      default:
        return {
          label: status,
          className: "bg-muted text-muted-foreground border-border",
          icon: ShieldAlert,
          dotColor: "bg-muted-foreground",
        };
    }
  };

  // Metrics overview calculations
  const metrics = useMemo(() => {
    const total = bookings.length;
    const active = bookings.filter((b) =>
      ["pending", "accepted", "in_progress"].includes(b.status)
    ).length;
    const completed = bookings.filter((b) => b.status === "completed").length;
    const spent = bookings
      .filter((b) => b.status === "completed")
      .reduce((sum, b) => sum + (b.price || 0), 0);

    return { total, active, completed, spent };
  }, [bookings]);

  // Filtered list based on search and selected tab
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        booking.service?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.provider?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.address?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTab =
        activeTab === "all"
          ? true
          : activeTab === "active"
          ? ["pending", "accepted", "in_progress"].includes(booking.status)
          : booking.status === activeTab;

      return matchesSearch && matchesTab;
    });
  }, [bookings, searchQuery, activeTab]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 space-y-4">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            My Bookings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your scheduled appointments and past service history.
          </p>
        </div>
        <Link
          to="/services"
          className="inline-flex items-center gap-2 self-start rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] sm:self-auto"
        >
          <Sparkles className="h-4 w-4" />
          Book New Service
        </Link>
      </div>

      {/* Metrics Banner */}
      {!isLoading && bookings.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-2xl border border-border/50 bg-card/60 p-4 backdrop-blur-sm">
            <p className="text-xs font-medium text-muted-foreground">Total Bookings</p>
            <p className="mt-1 text-2xl font-bold">{metrics.total}</p>
          </div>
          <div className="rounded-2xl border border-border/50 bg-card/60 p-4 backdrop-blur-sm">
            <p className="text-xs font-medium text-muted-foreground">Active / Pending</p>
            <p className="mt-1 text-2xl font-bold text-amber-500">{metrics.active}</p>
          </div>
          <div className="rounded-2xl border border-border/50 bg-card/60 p-4 backdrop-blur-sm">
            <p className="text-xs font-medium text-muted-foreground">Completed</p>
            <p className="mt-1 text-2xl font-bold text-emerald-500">{metrics.completed}</p>
          </div>
          <div className="rounded-2xl border border-border/50 bg-card/60 p-4 backdrop-blur-sm">
            <p className="text-xs font-medium text-muted-foreground">Total Spent</p>
            <p className="mt-1 text-2xl font-bold text-primary">
              ₹{metrics.spent.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      )}

      {/* Filters & Search Toolbar */}
      {!isLoading && bookings.length > 0 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Status Tabs */}
          <div className="flex overflow-x-auto rounded-xl border border-border/60 bg-muted/40 p-1 no-scrollbar">
            {[
              { id: "all", label: "All" },
              { id: "active", label: "Active" },
              { id: "completed", label: "Completed" },
              { id: "cancelled", label: "Cancelled" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by title, provider..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 w-full animate-pulse rounded-2xl border border-border/50 bg-card/40"
            />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        /* Zero Bookings Empty State */
        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-3xl border border-dashed border-border p-8 text-center bg-card/20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 mb-4">
            <CalendarDays className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            No bookings yet
          </h2>
          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
            You haven't reserved any services. Discover our top-rated offerings and book today!
          </p>
          <Link
            to="/services"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 shadow-md"
          >
            Explore Services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : filteredBookings.length === 0 ? (
        /* Search/Filter Empty State */
        <div className="flex min-h-[30vh] flex-col items-center justify-center rounded-2xl border border-dashed border-border p-8 text-center">
          <Filter className="h-8 w-8 text-muted-foreground mb-3" />
          <h3 className="text-base font-semibold">No bookings found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search query or status filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveTab("all");
            }}
            className="mt-4 text-xs font-medium text-primary hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* Bookings List */
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const statusConfig = getStatusBadge(booking.status);

            return (
              <article
                key={booking._id}
                className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card/50 p-6 transition-all duration-200 hover:border-border hover:bg-card hover:shadow-xl hover:shadow-primary/5"
              >
                {/* Header Row: Title, Badge, Price */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                        {booking.service?.title}
                      </h2>

                      {/* Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusConfig.className}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dotColor}`} />
                        {statusConfig.label}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-muted-foreground">
                      Category: {booking.service?.category}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="flex items-center text-xl font-extrabold text-foreground">
                    <IndianRupee className="h-4 w-4" />
                    <span>
                      {booking.price?.toLocaleString("en-IN") ?? "0"}
                    </span>
                  </div>
                </div>

                {/* Grid Details */}
                <div className="mt-6 grid grid-cols-1 gap-4 rounded-xl border border-border/40 bg-muted/20 p-4 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Date */}
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-background p-2 text-muted-foreground border border-border/40">
                      <CalendarDays className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Date</p>
                      <p className="mt-0.5 text-sm font-semibold text-foreground">
                        {formatDate(booking.scheduledAt)}
                      </p>
                    </div>
                  </div>

                  {/* Time Slot */}
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-background p-2 text-muted-foreground border border-border/40">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Time Slot</p>
                      <p className="mt-0.5 text-sm font-semibold text-foreground">
                        {formatTime(booking.scheduledAt)} - {formatTime(booking.endAt)}
                      </p>
                    </div>
                  </div>

                  {/* Service Provider */}
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-background p-2 text-muted-foreground border border-border/40">
                      <UserRound className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Provider</p>
                      <p className="mt-0.5 text-sm font-semibold text-foreground">
                        {booking.provider?.name || "Assigned Provider"}
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="rounded-lg bg-background p-2 text-muted-foreground border border-border/40 shrink-0">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground font-medium">Address</p>
                      <p className="mt-0.5 truncate text-sm font-semibold text-foreground" title={booking.address}>
                        {booking.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Action Bar */}
                <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-4">
                  <span className="text-xs text-muted-foreground">
                    Booking Ref ID: <code className="text-xs font-mono">{booking._id.slice(-8)}</code>
                  </span>

                  <Link
                    to={`/booking/${booking._id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all hover:gap-2 hover:underline"
                  >
                    View details
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default BookingsPage;