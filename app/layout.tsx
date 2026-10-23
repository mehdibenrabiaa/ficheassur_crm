import type {Metadata} from 'next';
import {Google_Sans_Flex} from 'next/font/google';
import {TooltipProvider} from '@/components/ui/tooltip';
import Shell from '@/components/Shell';
import {ToastProvider, Toaster} from '@/components/ui/toast';
import './globals.css';

const siteSans = Google_Sans_Flex({variable: '--font-site-sans', subsets: ['latin'], weight: 'variable', axes: ['slnt'], display: 'swap'});
export const metadata: Metadata = {title: 'FicheAssur CRM', description: 'Gestion des contenus, clients et ventes FicheAssur.', robots: {index: false, follow: false}};
export default function Layout({children}: {children: React.ReactNode}) {return <html lang="fr" className={`${siteSans.variable} h-full antialiased`}><body className="flex min-h-full flex-col"><ToastProvider><TooltipProvider><Shell>{children}</Shell></TooltipProvider><Toaster /></ToastProvider></body></html>;}
