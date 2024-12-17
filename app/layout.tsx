import '@/app/ui/global.css'
import { inter } from './ui/fonts';
import { Metadata, } from 'next';

export const metadata: Metadata = {
	title: {
		template: '%s | Acme Dashboard',
		default: 'Acme Dashboard'
	},
	description: 'Learning Next js',
	 metadataBase: new URL('https://next-app.vercel.sh'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
