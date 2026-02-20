'use client';

import React from 'react';
import { Session } from '@supabase/supabase-js';
import Image from 'next/image';
import Link from 'next/link';
import { LogIn } from 'lucide-react';
import { Button } from 'components/ui/button';

interface UserAvatarProps {
  session?: Session | null;
}

const UserAvatar = (props: UserAvatarProps) => {
  const { session } = props;

  if (!session) {
    return (
      <Button variant="secondary" asChild>
        <Link href="/login" className="flex gap-2 items-center justify-center">
          <LogIn size={14} />
          <span>Login</span>
        </Link>
      </Button>
    );
  }

  const avatarUrl = session.user.user_metadata?.avatar_url;

  return (
    <Link href="/login" className="hover:opacity-80">
      <Image
        src={avatarUrl}
        alt="User avatar"
        width={40}
        height={40}
        className="rounded-full"
        priority
      />
    </Link>
  );
};

export default UserAvatar;
