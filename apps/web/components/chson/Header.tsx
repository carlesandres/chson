'use client';

import Link from 'next/link';
import { ThemeToggle } from 'components/ThemeToggle';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from 'components/ui/navigation-menu';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Docs', href: '/docs' },
  { name: 'Cheatsheets', href: '/cheatsheets' },
];

export function Header() {
  return (
    <header className="animate-slide-in rounded-2xl border border-border/50 bg-card/70 px-3 py-2 shadow-soft backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          className="rounded-xl px-2 py-2 font-display text-base font-semibold tracking-[-0.02em]"
          href="/"
        >
          ChSON
        </Link>
        <div className="flex items-center gap-2">
          <NavigationMenu>
            <NavigationMenuList className="gap-1">
              {navigation.map((item) => (
                <NavigationMenuItem key={item.name}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {item.name}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  href="https://github.com/carlesandres/csif.sh"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
