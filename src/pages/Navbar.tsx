"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Menu } from "lucide-react"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navItems = [
  { name: "Home", href: "#hero" },
  { name: "Why Choose Us", href: "#features" },
  { name: "Get Started", href: "#cta" },
  { name: "More Projects", href: "#projects" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed w-full top-0 left-0 z-50 bg-white/5 backdrop-blur-sm p-4"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a href="#hero" className="flex items-center text-2xl font-bold text-black">
              Dyrane <span className="italic text-lg ml-2">Intelligence Collective</span>
            </a>
          </div>
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <NavigationMenuLink
                      href={item.href}
                      className={navigationMenuTriggerStyle() + "relative overflow-hidden bg-transparent group hover:bg-black hover:text-white"}
                    >
                      {item.name}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="hidden md:block">
            <Button asChild className="rounded-full relative overflow-hidden group">
              <a
                href="https://wa.me/19517284218?text=Hi%20Dr.%20Dyrane,%20I'm%20interested%20in%20working%20with%20you!"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white hover:text-black transition-colors duration-300"
              >
                <span className="relative z-10">Get Started</span>
                <span className="absolute inset-0 rounded-full bg-white transform scale-x-0 transition-transform duration-500 origin-left group-hover:scale-x-100"></span>
              </a>
            </Button>
          </div>
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px] bg-white/80 backdrop-blur-md rounded-l-3xl border-none"
              >
                <nav className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-4 py-2 text-lg hover:bg-black hover:text-white rounded-full transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}
                  <Button asChild className="mt-4 rounded-full relative overflow-hidden group py-6">
                    <a
                      href="https://wa.me/19517284218?text=Hi%20Dr.%20Dyrane,%20I'm%20interested%20in%20working%20with%20you!"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-black text-white hover:text-black transition-colors duration-300"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="relative z-10">Get Started</span>
                      <span className="absolute rounded-full inset-0 bg-white transform scale-x-0 transition-transform duration-500 origin-left group-hover:scale-x-100"></span>
                    </a>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

