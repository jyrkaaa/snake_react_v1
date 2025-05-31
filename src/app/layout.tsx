import './globals.css'
import type { Metadata } from 'next'
import 'bootstrap/dist/css/bootstrap.css';
import "./globals.css";
import BootstrapActivation from "@/helpers/BootstrapActivation";
export const metadata: Metadata = {
    title: 'My 2D Game',
    description: 'A simple 2D game built with React + TypeScript + Next.js',
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main>
            {children}
            <BootstrapActivation/>
        </main>
      </body>
    </html>
  );
}
