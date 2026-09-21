import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold tracking-tight flex items-center"
        >
          <span className="block bg-primary h-10 w-10 flex items-center justify-center rounded-xl mr-2">S</span>Service<span className="font-bold text-primary">Hub</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" asChild>
            <Link to="/services" className="flex items-center justify-center">
              <Search className="mr-2 size-4" />
              Services
            </Link>
          </Button>

          <Button variant="ghost" asChild>
            <Link to="/login">
              Login
            </Link>
          </Button>

          <Button asChild>
            <Link to="/register">
              Get Started
            </Link>
          </Button>
        </nav>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() =>
            setIsMobileMenuOpen((previous) => !previous)
          }
          aria-label="Toggle navigation"
        >
          {isMobileMenuOpen ? (
            <X />
          ) : (
            <Menu />
          )}
        </Button>
      </div>

      {/* Mobile navigation */}
      {isMobileMenuOpen && (
        <nav className="border-t px-6 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            <Button
              variant="ghost"
              className="justify-start"
              asChild
            >
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Search className="mr-2 size-4" />
                Services
              </Link>
            </Button>

            <Button
              variant="ghost"
              className="justify-start"
              asChild
            >
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
            </Button>

            <Button
              className="justify-start"
              asChild
            >
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;