import { ChevronDown, LogOut, LogOutIcon, Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/useAuth";
  
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const getInitials = (name = "") => {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase())
        .join("");
};
  
const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const navigate = useNavigate();
  
    const {
      user,
      isAuthenticated,
      logout,
    } = useAuth();
  
    const handleLogout = () => {
      logout();
  
      setIsProfileOpen(false);
      setIsMobileMenuOpen(false);
  
      toast.success("Logged out successfully");
  
      navigate("/");
    };
  
    return (
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
  
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-bold tracking-tight flex items-center"
          >
            <span className="block bg-primary h-10 w-10 flex items-center justify-center rounded-xl mr-2">
              S
            </span>
            Service
            <span className="font-bold text-primary">
              Hub
            </span>
          </Link>
  
          {/* Desktop navigation */}
          <nav className="hidden items-center gap-2 md:flex">
  
            <Button variant="ghost" asChild>
              <Link
                to="/services"
                className="flex items-center justify-center"
              >
                <Search className="mr-2 size-4" />
                Services
              </Link>
            </Button>
  
            {isAuthenticated && (
              <>
                {user?.role === "customer" && (
                  <Button variant="ghost" asChild>
                    <Link to="/bookings">
                      My Bookings
                    </Link>
                  </Button>
                )}
  
                {user?.role === "provider" && (
                  <Button variant="ghost" asChild>
                    <Link to="/provider">
                      Dashboard
                    </Link>
                  </Button>
                )}
  
                {/* Profile dropdown */}
                {/* <div className="relative ml-2">
                    <Button
                        variant="link"
                        className="gap-2 no-underline! hover:bg-transparent! active:bg-transparent! hover:cursor-pointer"
                        onClick={() =>
                        setIsProfileOpen(
                            (previous) => !previous
                        )
                        }
                        aria-expanded={isProfileOpen}
                    >
                        <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                            {getInitials(user?.name)}
                        </span>
    
                        <span className="max-w-32 truncate">
                            {user?.name}
                        </span>
    
                        <ChevronDown
                            className={`size-4 transition-transform ${
                                isProfileOpen
                                ? "rotate-180"
                                : ""
                            }`}
                        />
                    </Button>
  
                  {isProfileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border bg-background p-1 shadow-md">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                      >
                        <LogOut className="size-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div> */}
                <DropdownMenu>
                    <DropdownMenuTrigger render={
                        <Button variant="link" className="rounded-full hover:no-underline">
                            <Avatar>
                                {/* <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" /> */}
                                <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                            </Avatar>
                            <div className="user-info text-start">
                                <p className="text-white">{user?.name}</p>
                                {/* <p className="text-xs font-medium text-slate-400">{user?.email}</p> */}
                            </div>
                        </Button>} />
                    <DropdownMenuContent align="end" >
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOutIcon />
                            Sign Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
  
            {!isAuthenticated && (
              <>
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
              </>
            )}
  
          </nav>
  
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() =>
              setIsMobileMenuOpen(
                (previous) => !previous
              )
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
                  to="/services"
                  onClick={() =>
                    setIsMobileMenuOpen(false)
                  }
                >
                  <Search className="mr-2 size-4" />
                  Services
                </Link>
              </Button>
  
              {isAuthenticated ? (
                <>
                  {user?.role === "customer" && (
                    <Button
                      variant="ghost"
                      className="justify-start"
                      asChild
                    >
                      <Link
                        to="/bookings"
                        onClick={() =>
                          setIsMobileMenuOpen(false)
                        }
                      >
                        My Bookings
                      </Link>
                    </Button>
                  )}
  
                  {user?.role === "provider" && (
                    <Button
                      variant="ghost"
                      className="justify-start"
                      asChild
                    >
                      <Link
                        to="/provider"
                        onClick={() =>
                          setIsMobileMenuOpen(false)
                        }
                      >
                        Dashboard
                      </Link>
                    </Button>
                  )}
  
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 size-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="justify-start"
                    asChild
                  >
                    <Link
                      to="/login"
                      onClick={() =>
                        setIsMobileMenuOpen(false)
                      }
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
                      onClick={() =>
                        setIsMobileMenuOpen(false)
                      }
                    >
                      Get Started
                    </Link>
                  </Button>
                </>
              )}
  
            </div>
          </nav>
        )}
      </header>
    );
  };
  
  export default Navbar;