import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Search,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Star,
  Clock,
  Sparkles,
  Wrench,
  Car,
  Home,
  Zap,
  CheckCircle2,
  ChevronRight,
  Users,
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
    <div className="relative min-h-screen bg-[#0a0d14] text-foreground selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Radial Glow (Reference Theme) */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-full max-w-7xl -translate-x-1/2 bg-gradient-to-b from-cyan-500/15 via-blue-600/10 to-transparent blur-3xl opacity-70" />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32">
        <div className="mx-auto max-w-5xl px-6 text-center">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1.5 text-xs font-medium text-cyan-400 backdrop-blur-md mb-8">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>On-Demand Local Services Made Simple</span>
          </div>

          {/* Main Headline (Matching Reference Typography) */}
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl leading-[1.1]">
            We Make Home Services <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-sky-500 bg-clip-text text-transparent">
              As Effortless As You Want
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-400 leading-relaxed">
            Discover background-verified technicians, Compare upfront quotes, and book doorstep local services on your schedule.
          </p>

          {/* Hero Search Box */}
          <form
            onSubmit={handleSearch}
            className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-2 shadow-2xl backdrop-blur-xl sm:flex-row sm:items-center"
          >
            <div className="flex flex-1 items-center gap-3 px-3 py-2">
              <Search className="h-5 w-5 text-cyan-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="AC service, car wash, plumber..."
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
              />
            </div>

            <div className="hidden h-6 w-px bg-slate-800 sm:block" />

            <div className="flex items-center gap-2 px-3 py-2 text-slate-400 text-xs">
              <MapPin className="h-4 w-4 text-slate-500 shrink-0" />
              <span className="truncate">Your Location</span>
            </div>

            <Button
              type="submit"
              size="lg"
              className="h-12 gap-2 rounded-xl bg-cyan-400 px-6 font-semibold text-slate-950 transition-all hover:bg-cyan-300 active:scale-[0.98]"
            >
              Search
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Trust Badges Bar */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs font-medium text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
              <span>4.9 Star Rated Mechanics & Pros</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
              <span>100% Satisfaction Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
              <span>Transparent Upfront Pricing</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Showcase Section (Reference Layout Match) */}
      <section className="relative border-t border-slate-800/80 bg-slate-950/50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Services We Provide
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Explore our most requested home and vehicle care solutions.
              </p>
            </div>

            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 hover:underline"
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
                  className={`group relative overflow-hidden border transition-all duration-300 ${
                    item.active
                      ? "border-cyan-500/50 bg-slate-900 shadow-xl shadow-cyan-950/30"
                      : "border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/80"
                  }`}
                >
                  <CardContent className="p-6 flex flex-col justify-between h-full min-h-[220px]">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="rounded-xl bg-slate-800 p-3 text-cyan-400 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-colors">
                          <Icon className="h-6 w-6" />
                        </div>
                        {item.active && (
                          <Badge variant="outline" className="border-cyan-500/40 text-cyan-400 text-[10px]">
                            Popular
                          </Badge>
                        )}
                      </div>

                      <h3 className="mt-6 text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <Link
                      to={`/services?category=${encodeURIComponent(item.title)}`}
                      className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 group-hover:text-cyan-400"
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

      {/* Why Choose ServiceHub Section */}
      <section className="py-20 border-t border-slate-800/80">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Engineered For Reliability
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              We eliminated the uncertainty of finding local contractors so you get guaranteed service quality.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-900/30 p-8 backdrop-blur-sm transition hover:border-slate-700"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-lg font-bold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-950/60 border-t border-slate-800/80">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5 space-y-4">
              <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
                Simple 3-Step Process
              </Badge>
              <h2 className="text-3xl font-bold text-white sm:text-4xl leading-tight">
                How ServiceHub Works
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Booking a service takes less than two minutes. Experience a frictionless workflow from searching to doorstep service delivery.
              </p>
            </div>

            <div className="lg:col-span-7 grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                <span className="text-2xl font-extrabold text-cyan-400">01</span>
                <h4 className="mt-3 text-base font-bold text-white">Search Service</h4>
                <p className="mt-1.5 text-xs text-slate-400">
                  Select your required service category and city location.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                <span className="text-2xl font-extrabold text-cyan-400">02</span>
                <h4 className="mt-3 text-base font-bold text-white">Pick Time Slot</h4>
                <p className="mt-1.5 text-xs text-slate-400">
                  Choose a convenient date and time for provider arrival.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                <span className="text-2xl font-extrabold text-cyan-400">03</span>
                <h4 className="mt-3 text-base font-bold text-white">Relax & Pay Later</h4>
                <p className="mt-1.5 text-xs text-slate-400">
                  Verified provider completes job. Pay safely after inspection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 border-t border-slate-800/80">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 p-10 sm:p-16 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-5xl">
              Ready to simplify your tasks?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-slate-300">
              Book top-rated professionals near you in just a few clicks.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                asChild
                className="h-12 bg-cyan-400 font-semibold text-slate-950 hover:bg-cyan-300"
              >
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