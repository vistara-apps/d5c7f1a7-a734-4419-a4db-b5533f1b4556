import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ThemeProvider } from './components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CollabSphere - Professional Networking Platform',
  description: 'Connect, Create, Collaborate: Achieve Your Goals Together',
  keywords: 'collaboration, networking, goals, skills, values, projects',
  authors: [{ name: 'CollabSphere Team' }],
  openGraph: {
    title: 'CollabSphere',
    description: 'Connect, Create, Collaborate: Achieve Your Goals Together',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <Providers>
            <div className="min-h-screen bg-gradient-to-br from-bg via-bg to-surface">
              {children}
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
