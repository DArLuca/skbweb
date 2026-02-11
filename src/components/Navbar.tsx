import { useState } from "react";
import { Link } from "react-router-dom"; // Add this
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { buttonVariants } from "./ui/button";
import { Menu, Trophy } from "lucide-react"; // Trophy is a good chess icon
import { ModeToggle } from "./mode-toggle";

const routeList = [
  { href: "/news", label: "News" },
  { href: "/meisterschaft", label: "Meisterschaft" },
  { href: "/verein", label: "Verein" },
  { href: "/jugend", label: "Jugend" },
  { href: "/agenda", label: "Agenda" },
  { href: "/shop", label: "Shop" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between ">
          <NavigationMenuItem className="font-bold flex">
            {/* BRAND LOGO */}
            <Link to="/" className="ml-2 font-bold text-xl flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              SKB
            </Link>
          </NavigationMenuItem>

          {/* MOBILE NAVIGATION */}
          <span className="flex md:hidden">
            <ModeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2">
                <Menu className="flex md:hidden h-5 w-5" onClick={() => setIsOpen(true)} />
              </SheetTrigger>
              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl text-left">SKB</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                  {routeList.map(({ href, label }) => (
                    <Link
                      key={label}
                      to={href}
                      onClick={() => setIsOpen(false)}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      {label}
                    </Link>
                  ))}
                  <Link
                    to="/mitglied-werden"
                    className={`w-[130px] border ${buttonVariants({ variant: "default" })}`}
                  >
                    Mitglied werden
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden md:flex gap-2">
            {routeList.map((route, i) => (
              <Link
                to={route.href}
                key={i}
                className={`text-[17px] ${buttonVariants({ variant: "ghost" })}`}
              >
                {route.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex gap-2">
            <Link
              to="/mitglied-werden"
              className={`border ${buttonVariants({ variant: "default" })}`}
            >
              Mitglied werden
            </Link>
            <ModeToggle />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};