import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Mail,
  Copy,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
} from "lucide-react";

import {
  cancelBooking,
  getBookingById,
  type Booking,
} from "@/api/bookingApi";
import { useAuth } from "@/context/useAuth";

// shadcn/ui components (adjust import paths to match your project setup)
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const BookingDetailPage = () => {
  const { id } = useParams();
  const { token } = useAuth();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!id || !token) return;

      try {
        setIsLoading(true);
        setError(null);

        const data = await getBookingById(id, token);
        setBooking(data.booking);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load booking details"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [id, token]);

  const handleCancelBooking = async () => {
    if (!token || !booking) return;

    try {
      setIsCancelling(true);
      await cancelBooking(booking._id, token);

      toast.success("Booking cancelled successfully");

      // Refresh booking details
      const data = await getBookingById(booking._id, token);
      setBooking(data.booking);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to cancel booking"
      );
    } finally {
      setIsCancelling(false);
    }
  };

  const copyBookingId = () => {
    if (booking?._id) {
      navigator.clipboard.writeText(booking._id);
      toast.success("Booking ID copied to clipboard!");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return (
          <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700">
            <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
            Confirmed
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-300">
            <Clock className="mr-1 h-3.5 w-3.5" />
            Pending
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3.5 w-3.5" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="capitalize">
            {status.replace("_", " ")}
          </Badge>
        );
    }
  };

  // --- Skeleton Loading State ---
  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Skeleton className="h-64 rounded-xl md:col-span-2" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  // --- Error State ---
  if (error || !booking) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center px-4">
        <Card className="w-full text-center">
          <CardHeader className="flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertCircle className="h-6 w-6" />
            </div>
            <CardTitle className="mt-4 text-xl">Unable to load booking</CardTitle>
            <CardDescription>
              {error || "The requested booking details could not be found."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="default">
              <Link to="/bookings">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to bookings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formattedDate = new Date(booking.scheduledAt).toLocaleDateString(
    undefined,
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
  const formattedTime = new Date(booking.scheduledAt).toLocaleTimeString(
    undefined,
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">

      {/* Main Header / Overview Banner */}
      <Card className="mb-6 overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                {getStatusBadge(booking.status)}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyBookingId}
                  className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground hover:bg-transparent"
                >
                  <span>ID: {booking._id.slice(-8)}</span>
                  <Copy className="ml-1 h-3 w-3" />
                </Button>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {booking.service.title}
              </h1>
            </div>

            <div className="sm:text-right">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Total Amount
              </span>
              <p className="text-3xl font-extrabold text-foreground">
                ₹{booking.price.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid Content Layout */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Main Details Column */}
        <div className="space-y-6 md:col-span-2">
          {/* Schedule & Location Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Schedule & Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Date & Time
                  </p>
                  <p className="font-semibold text-foreground">{formattedDate}</p>
                  <p className="text-sm text-muted-foreground">
                    {formattedTime} ({booking.duration} mins session)
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Service Address
                  </p>
                  <p className="text-sm font-medium text-foreground mt-0.5">
                    {booking.address}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Provider Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Service Provider</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-4 rounded-lg border bg-muted/30 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-lg">
                    {booking.provider.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {booking.provider.name}
                    </p>
                    <p className="flex items-center text-xs text-muted-foreground mt-0.5">
                      <Mail className="mr-1 h-3.5 w-3.5" />
                      {booking.provider.email}
                    </p>
                  </div>
                </div>

                <Button variant="outline" size="sm" asChild>
                  <a href={`mailto:${booking.provider.email}`}>Contact</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span className="font-medium">₹{booking.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{booking.duration} mins</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold">
                <span>Total Amount</span>
                <span className="text-primary">₹{booking.price}</span>
              </div>
            </CardContent>
          </Card>

          {/* Cancel Action Card */}
          {booking.status === "pending" && (
            <Card className="border-destructive/30 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-destructive">
                  Cancel Booking
                </CardTitle>
                <CardDescription className="text-xs">
                  Need to reschedule or change plans? You can cancel this pending booking.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full" size="sm">
                      Cancel Booking
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will cancel your booking for{" "}
                        <strong className="text-foreground">{booking.service.title}</strong>. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleCancelBooking}
                        disabled={isCancelling}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isCancelling ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Cancelling...
                          </>
                        ) : (
                          "Yes, Cancel Booking"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;