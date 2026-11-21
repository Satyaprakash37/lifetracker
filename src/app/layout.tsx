import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LifeTracker • Gamified Habit & Discipline Matrix',
  description: 'Track daily habits, weekly analytics, and level up your discipline like a game.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F0F3F8] text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}

