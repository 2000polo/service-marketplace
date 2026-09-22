import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { format } from "date-fns";

import {
  Clock,
  CheckCircle2,
  ShieldCheck,
  Star,
  MapPin,
  Sparkles,
  CreditCard,
  Info,
  CalendarIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useAuth } from "@/context/useAuth";
import { getAvailableSlots, type AvailabilitySlot } from "@/api/availabilityApi";
import { getServiceById } from "@/api/servicesApi";
import { createBooking } from "@/api/bookingApi";
import type { Service } from "@/types/service";

const CreateBookingPage = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Default date initialized to Today's Date
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [address, setAddress] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  // Formatted date string (YYYY-MM-DD) for API queries
  const dateQueryString = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";

  // Fetch Service Info
  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId) return;

      try {
        const data = await getServiceById(serviceId);
        setService(data);
      } catch (error) {
        console.error("Failed to fetch service:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  // Fetch Slots when Date or Service changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!dateQueryString || !service?.provider?._id || !serviceId) {
        setSlots([]);
        setSelectedSlot(null);
        return;
      }

      try {
        setIsLoadingSlots(true);
        setSelectedSlot(null);

        const data = await getAvailableSlots(
          service.provider._id,
          serviceId,
          dateQueryString
        );

        setSlots(data.slots || []);
      } catch (error) {
        console.error("Failed to fetch available slots:", error);
        setSlots([]);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [dateQueryString, service, serviceId]);

  const handleBooking = async () => {
    if (!serviceId || !dateQueryString || !selectedSlot || !address.trim() || !token) {
      return;
    }

    try {
      setIsBooking(true);

      const scheduledAt = new Date(
        `${dateQueryString}T${selectedSlot.startTime}:00.000Z`
      ).toISOString();

      const data = await createBooking(
        {
          service: serviceId,
          scheduledAt,
          address: address.trim(),
        },
        token
      );

      navigate(`/booking/${data.booking._id}`);
    } catch (error) {
      console.error("Failed to create booking:", error);
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[400px] max-w-6xl items-center justify-center px-6 py-12">
        <div className="flex items-center space-x-3 text-muted-foreground">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <span className="text-sm font-medium">Loading booking details...</span>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-6 text-center">
          <p className="text-sm font-medium text-destructive">
            Service not found or may have been removed.
          </p>
          <Button variant="outline" size="sm" className="mt-4" >
            <Link to="/services">Back to Services</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      
      <div className="grid gap-8 lg:grid-cols-12 ">
        {/* LEFT COLUMN: Service Overview & Pricing */}
        <Card className="flex flex-col justify-between border-border/60 shadow-sm lg:col-span-8">
          <div>
            <CardHeader className="space-y-3 pb-4">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="gap-1.5 px-3 py-1 font-medium text-xs">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Service Overview
                </Badge>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="mr-1.5 h-3.5 w-3.5" />
                  {service.duration || 60} mins duration
                </div>
              </div>

              <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">
                {service.title}
              </CardTitle>

              {service.description && (
                <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </CardDescription>
              )}
            </CardHeader>

            <CardContent className="space-y-6 ">
              {/* Provider Info Block */}
              <div className="flex flex-col md:flex-row md:items-center justify-between rounded-xl border bg-muted/30 p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border">
                    <AvatarImage src={''} alt={service.provider?.name} />
                    <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                      {service.provider?.name?.substring(0, 2).toUpperCase() || "PV"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold">{service.provider?.name || "Service Provider"}</p>
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    </div>
                    <p className="text-xs text-muted-foreground">Verified Professional Provider</p>
                  </div>
                </div>

                <div className="mt-2 md:mt-0 w-fit flex items-center gap-1 rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  4.9 (120+ reviews)
                </div>
              </div>

              {/* Service Highlights / What's Included */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  What's Included & Guarantees
                </h4>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    Professional & vetted doorstep service
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    100% Satisfaction Guarantee
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    Transparent pricing with zero hidden costs
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    Free reschedule up to 2 hours prior
                  </div>
                </div>
              </div>

              <Separator />

              {/* Service Delivery Specs */}
              <div className="grid md:grid-cols-2 gap-4 rounded-lg bg-background p-3 text-xs border">
                <div className="flex items-center gap-2">
                  <MapPin className="h-10 w-10 p-2 text-primary bg-accent rounded-lg" />
                  <div>
                    <span className="font-medium text-foreground block">At Your Location</span>
                    <span className="text-muted-foreground">Provider comes directly to you</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-10 w-10 p-2 text-primary bg-accent rounded-lg" />
                  <div>
                    <span className="font-medium text-foreground block">Pay After Service</span>
                    <span className="text-muted-foreground">Safe & secure booking</span>
                  </div>
                </div>
              </div>
            </CardContent>

          </div>

          {/* Service Price & Footer Info */}
          {/* <div className="hidden md:block">
            <Separator />
            <CardFooter className="flex flex-col items-start justify-between gap-4 bg-muted/20 p-6 sm:flex-row sm:items-center">
              <div>
                <span className="text-xs font-medium text-muted-foreground block">Total Service Price</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold tracking-tight text-white">
                    ₹{service.price?.toLocaleString() || "0"}
                  </span>
                  <span className="text-xs text-muted-foreground font-normal">/ session</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background px-3 py-1.5 rounded-md border">
                <Info className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>Inclusive of all taxes & doorstep convenience fee</span>
              </div>
            </CardFooter>
          </div> */}
        </Card>

        {/* RIGHT COLUMN: Date Picker, Slots & Address */}
        <Card className="flex flex-col justify-between border-border/60 shadow-sm lg:col-span-4">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold">Schedule Appointment</CardTitle>
            <CardDescription className="text-xs">
              Pick your preferred date, time slot, and delivery address.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Date Selection via shadcn Calendar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-primary" />
                  Select Date
                </Label>
                {selectedDate && (
                  <span className="text-xs font-medium text-primary">
                    {format(selectedDate, "PPP")}
                  </span>
                )}
              </div>

              <div className="flex justify-center rounded-lg border p-2 bg-background">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  }}
                  className="rounded-md w-full"
                />
              </div>
            </div>

            {/* Time Slot Selection */}
            <div className="space-y-2.5">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Available Time Slots
              </Label>

              {isLoadingSlots ? (
                <div className="flex items-center justify-center py-6 text-xs text-muted-foreground gap-2">
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  Fetching slots...
                </div>
              ) : !selectedDate ? (
                <p className="text-xs text-muted-foreground">Please select a date to view slots.</p>
              ) : slots.length === 0 ? (
                <div className="rounded-md border border-dashed p-4 text-center text-xs text-muted-foreground">
                  No slots available for this date. Try picking another date above.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {slots.map((slot) => {
                    const isSelected = selectedSlot?.startTime === slot.startTime;
                    return (
                      <Button
                        key={slot.startTime}
                        type="button"
                        size="sm"
                        variant={isSelected ? "default" : "outline"}
                        className={`text-xs h-9 ${isSelected ? "shadow-sm font-bold" : ""}`}
                        onClick={() => setSelectedSlot(slot)}
                      >
                        {slot.startTime}
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Service Address Input */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Service Address
              </Label>
              <Textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter complete address (House/Flat No., Street, City, Pincode)"
                rows={3}
                className="resize-none text-xs leading-relaxed"
              />
            </div>

            {/* Booking Summary Box */}
            {selectedDate && selectedSlot && (
              <div className="rounded-lg bg-primary/5 p-3 text-xs space-y-1.5 border border-primary/20">
                <div className="flex justify-between font-medium text-foreground">
                  <span>Selected Schedule:</span>
                  <span>{format(selectedDate, "MMM dd, yyyy")} at {selectedSlot.startTime}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Payable Amount:</span>
                  <span className="font-semibold text-primary">₹{service.price}</span>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="pt-2 flex flex-col items-stretch md:items-start">
			<div className="flex flex-col gap-2 mb-3">
				<div>
					<span className="text-xs font-medium text-muted-foreground block">Total Service Price</span>
					<div className="flex items-baseline gap-1.5">
					<span className="text-3xl font-extrabold tracking-tight text-white">
						₹{service.price?.toLocaleString() || "0"}
					</span>
					<span className="text-xs text-muted-foreground font-normal">/ session</span>
					</div>
				</div>

				<div className="flex items-center gap-2 text-xs text-muted-foreground bg-background px-3 py-1.5 rounded-md border">
					<Info className="h-4 w-4 text-muted-foreground shrink-0" />
					<span>Inclusive of all taxes & doorstep convenience fee</span>
				</div>
			</div>
            <Button
              type="button"
              onClick={handleBooking}
              disabled={!selectedDate || !selectedSlot || !address.trim() || isBooking}
              className="w-full h-11 text-sm font-semibold"
            >
              {isBooking ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Processing Booking...
                </div>
              ) : (
                `Confirm Booking • ₹${service.price}`
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CreateBookingPage;