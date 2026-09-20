import { ArrowRight, MapPin, Search, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const HomePage = () => {
  return (
    <div>
      {/* Hero */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-medium text-muted-foreground">
              Local services, made simple
            </p>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Find the right professional for your next task.
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              Discover trusted service providers near you,
              compare prices, and book a time that works for you.
            </p>

            {/* Search */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <div className="flex flex-1 items-center gap-3 rounded-lg border bg-background px-4">
                <Search className="size-5 text-muted-foreground" />

                <input
                  type="text"
                  placeholder="What service do you need?"
                  className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>

              <Button size="lg">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <MapPin className="size-6" />

              <h2 className="mt-4 font-semibold">
                Local professionals
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Find service providers available in your city.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <ShieldCheck className="size-6" />

              <h2 className="mt-4 font-semibold">
                Trusted providers
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Discover professionals with ratings and reviews.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <ArrowRight className="size-6" />

              <h2 className="mt-4 font-semibold">
                Easy booking
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Choose a service, select a time, and book it.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default HomePage;