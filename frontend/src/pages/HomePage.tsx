import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Search,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Wrench,
  Car,
  Home,
  Zap,
  CheckCircle2,
  ChevronRight,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const popularCategories = [
  {
    id: "home-cleaning",
    title: "Home Cleaning",
    description: "Deep house cleaning, sanitization & specialized housekeeping.",
    icon: Home,
    active: true,
  },
  {
    id: "ac-repair",
    title: "AC & Appliance Repair",
    description: "Expert technician diagnostics, maintenance & fast servicing.",
    icon: Wrench,
    active: false,
  },
  {
    id: "car-care",
    title: "Car Detailing & Wash",
    description: "At-home premium eco car wash and interior foam detailing.",
    icon: Car,
    active: false,
  },
  {
    id: "electrical",
    title: "Electrical & Plumbing",
    description: "Licensed local electricians and plumbers on demand.",
    icon: Zap,
    active: false,
  },
];

const features = [
  {
    title: "Verified Local Professionals",
    description:
      "Every service provider undergoes background verification and skill assessment before joining.",
    icon: ShieldCheck,
  },
  {
    title: "Upfront & Transparent Pricing",
    description:
      "Know the exact cost before booking with guaranteed no hidden convenience fees.",
    icon: Sparkles,
  },
  {
    title: "Flexible Instant Scheduling",
    description:
      "Select custom time slots that fit your daily schedule with instant booking confirmation.",
    icon: Clock,
  },
];

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/services");
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Background Glow using Theme Variables */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-full max-w-7xl -translate-x-1/2 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent blur-3xl" />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32">
        <div className="mx-auto max-w-5xl px-6 text-center">
          {/* Top Pill Badge */}
          <Badge
            variant="outline"
            className="mb-8 inline-flex items-center gap-2 border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs text-primary"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>On-Demand Local Services Made Simple</span>
          </Badge>

          {/* Headline */}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl leading-[1.1]">
            We Make Home Services <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              As Effortless As You Want
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            Discover background-verified technicians, compare upfront quotes, and book doorstep local services on your schedule.
          </p>

          {/* Hero Search Box */}
          <form
            onSubmit={handleSearch}
            className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 rounded-2xl border border-border bg-card/80 p-2 shadow-xl backdrop-blur-md sm:flex-row sm:items-center"
          >
            <div className="flex flex-1 items-center gap-3 px-3 py-2">
              <Search className="h-5 w-5 text-primary shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="AC service, car wash, plumber..."
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
            </div>

            <div className="hidden h-6 w-px bg-border sm:block" />

            <div className="flex items-center gap-2 px-3 py-2 text-muted-foreground text-xs">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">Your Location</span>
            </div>

            <Button
              type="submit"
              size="lg"
              className="h-12 gap-2 rounded-xl font-semibold shadow-md transition-all active:scale-[0.98]"
            >
              Search
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs font-medium text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>4.9 Star Rated Mechanics & Pros</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>100% Satisfaction Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Transparent Upfront Pricing</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Showcase Section */}
      <section className="relative border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Services We Provide
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Explore our most requested home and vehicle care solutions.
              </p>
            </div>

            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Browse All Services
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {popularCategories.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.id}
                  className={`group relative overflow-hidden transition-all duration-300 ${
                    item.active
                      ? "border-primary/50 bg-card shadow-lg ring-1 ring-primary/20"
                      : "border-border bg-card/60 hover:border-border hover:bg-card"
                  }`}
                >
                  <CardContent className="p-6 flex flex-col justify-between h-full min-h-[220px]">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="rounded-xl bg-muted p-3 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <Icon className="h-6 w-6" />
                        </div>
                        {item.active && (
                          <Badge variant="secondary" className="text-[10px]">
                            Popular
                          </Badge>
                        )}
                      </div>

                      <h3 className="mt-6 text-lg font-bold group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <Link
                      to={`/services?category=${encodeURIComponent(item.title)}`}
                      className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground group-hover:text-primary"
                    >
                      Explore category
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Engineered For Reliability
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              We eliminated the uncertainty of finding local contractors so you get guaranteed service quality.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-card/40 p-8 transition hover:border-border/80 hover:bg-card/80"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-lg font-bold">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/20 border-t border-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5 space-y-4">
              <Badge variant="outline" className="border-primary/30 text-primary">
                Simple 3-Step Process
              </Badge>
              <h2 className="text-3xl font-bold sm:text-4xl leading-tight">
                How ServiceHub Works
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Booking a service takes less than two minutes. Experience a frictionless workflow from searching to doorstep service delivery.
              </p>
            </div>

            <div className="lg:col-span-7 grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <span className="text-2xl font-extrabold text-primary">01</span>
                <h3 className="mt-3 text-base font-bold">Search Service</h3>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Select your required service category and city location.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <span className="text-2xl font-extrabold text-primary">02</span>
                <h3 className="mt-3 text-base font-bold">Pick Time Slot</h3>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Choose a convenient date and time for provider arrival.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <span className="text-2xl font-extrabold text-primary">03</span>
                <h3 className="mt-3 text-base font-bold">Relax & Pay Later</h3>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Verified provider completes job. Pay safely after inspection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-r from-card via-primary/5 to-card p-10 sm:p-16 text-center">
            <h2 className="text-3xl font-bold sm:text-5xl">
              Ready to simplify your tasks?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-muted-foreground">
              Book top-rated professionals near you in just a few clicks.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="h-12 px-8 font-semibold">
                <Link to="/services">Explore Services Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;