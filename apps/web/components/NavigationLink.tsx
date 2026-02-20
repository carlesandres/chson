'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface NavigationLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavigationLink = (props: NavigationLinkProps) => {
  const { href, children } = props;
  const pathname = usePathname();
  const isActive = pathname === href;
  const activeClass = isActive ? 'text-blue-500' : '';

  return (
    <Link
      href={href}
      className={`text-sm flex gap-2 items-center font-medium ${activeClass} hover:opacity-75`}
    >
      {children}
    </Link>
  );
};

export default NavigationLink;
