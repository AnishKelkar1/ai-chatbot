'use client'; // This directive ensures the component is treated as a client component

import { SessionProvider } from 'next-auth/react';

export default function SessionProviderWrapper({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
