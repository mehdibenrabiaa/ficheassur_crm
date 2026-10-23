'use client';

import {Suspense, useEffect, useState} from 'react';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {BookOpenIcon, ExternalLinkIcon, LayoutDashboardIcon, ReceiptTextIcon, UsersIcon, ChartNoAxesCombinedIcon} from 'lucide-react';
import {api, SITE, TOKEN} from '@/lib/api';
import {NavMain} from '@/components/nav-main';
import {NavUser} from '@/components/nav-user';
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarInset, SidebarProvider, SidebarRail, SidebarTrigger, useSidebar} from '@/components/ui/sidebar';
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from '@/components/ui/breadcrumb';
import {Separator} from '@/components/ui/separator';
import {Button} from '@/components/ui/button';
import {PopupNotice} from '@/components/PopupNotice';

const groups = [
  {label: 'Général', items: [{title: 'Tableau de bord', url: '/dashboard', icon: <LayoutDashboardIcon />}]},
  {label: 'CRM', items: [{title: 'Leads', url: '/leads', icon: <ReceiptTextIcon />}, {title: 'Comptes clients', url: '/clients', icon: <UsersIcon />}, {title: 'Ventes & rapports', url: '/sales', icon: <ChartNoAxesCombinedIcon />}]},
  {label: 'Contenu', items: [{title: 'Articles & guides', url: '/articles', icon: <BookOpenIcon />} ]},
];

function Brand() {
  const {isMobile, setOpenMobile} = useSidebar();
  return <Link href="/dashboard" onClick={() => {if (isMobile) setOpenMobile(false);}} aria-label="FicheAssur — Tableau de bord" className="flex h-12 items-center gap-2 px-2 group-data-[collapsible=icon]:px-0"><img src="/brand/ficheassur-logo-white.svg" alt="FicheAssur" className="h-8 w-auto group-data-[collapsible=icon]:hidden" /><span className="bg-white/15 px-1.5 py-0.5 text-[11px] font-bold tracking-wider text-white group-data-[collapsible=icon]:hidden">CRM</span><span className="hidden size-8 items-center justify-center bg-white/10 text-sm font-bold text-white group-data-[collapsible=icon]:flex" aria-hidden="true">FA</span></Link>;
}

function AppSidebar({user}: {user: {full_name: string; email: string}}) {
  return <Sidebar collapsible="icon"><SidebarHeader><Brand /></SidebarHeader><SidebarContent>{groups.map(group => <NavMain key={group.label} label={group.label} items={group.items} />)}</SidebarContent><SidebarFooter><a href={SITE} target="_blank" rel="noreferrer" className="mx-2 mb-3 flex items-center gap-2 text-xs text-sidebar-foreground/75 hover:text-sidebar-foreground group-data-[collapsible=icon]:justify-center"><ExternalLinkIcon className="size-4 shrink-0" /><span className="group-data-[collapsible=icon]:hidden">Voir le site FicheAssur</span></a><NavUser user={{name: user.full_name, email: user.email, avatar: ''}} /></SidebarFooter><SidebarRail /></Sidebar>;
}

export default function Shell({children}: {children: React.ReactNode}) {return <Suspense fallback={<p className="loading">Chargement…</p>}><SessionShell>{children}</SessionShell></Suspense>;}

function SessionShell({children}: {children: React.ReactNode}) {
  const path = usePathname(); const router = useRouter();
  const [user, setUser] = useState<{full_name: string; email: string; role: string} | null>(null);
  const [error, setError] = useState(''); const [attempt, setAttempt] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useEffect(() => {setSidebarOpen(localStorage.getItem('ficheassur_crm_sidebar') !== 'false');}, []);
  useEffect(() => {
    if (path === '/connexion') return;
    const expire = () => {setUser(null); router.replace('/connexion');};
    window.addEventListener('crm-session-expired', expire); let active = true;
    if (!localStorage.getItem(TOKEN)) {expire(); return () => window.removeEventListener('crm-session-expired', expire);}
    setError('');
    api<{full_name: string; email: string; role: string}>('/api/v1/auth/me').then(u => {if (!active) return; if (u.role !== 'admin') {localStorage.removeItem(TOKEN); expire();} else setUser(u);}).catch(e => {if (active) setError(e.message);});
    return () => {active = false; window.removeEventListener('crm-session-expired', expire);};
  }, [path, router, attempt]);
  if (path === '/connexion') return <>{children}</>;
  if (!user) return <div className="session-wait"><img src="/brand/ficheassur-logo.svg" alt="FicheAssur" width="180" />{error ? <><PopupNotice message={error} title="Connexion au CRM interrompue" /><p>Impossible de vérifier votre accès pour le moment.</p><Button variant="outline" onClick={() => setAttempt(a => a + 1)}>Réessayer</Button><Link href="/connexion">Retour à la connexion</Link></> : <p>Vérification de votre accès…</p>}</div>;
  const current = groups.flatMap(g => g.items).find(item => path === item.url || path.startsWith(`${item.url}/`));
  return <SidebarProvider open={sidebarOpen} onOpenChange={open => {setSidebarOpen(open); localStorage.setItem('ficheassur_crm_sidebar', String(open));}}><a className="skip" href="#content">Aller au contenu</a><AppSidebar user={user} /><SidebarInset className="min-w-0"><header className="flex h-16 shrink-0 items-center gap-2 border-b"><div className="flex items-center gap-2 px-4"><SidebarTrigger className="-ml-1" aria-label="Afficher ou masquer le menu" /><Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" /><Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbPage>{current?.title || 'Administration'}</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb></div></header><div id="content" tabIndex={-1} className="crm-content flex flex-1 flex-col gap-4 p-4 pt-0"><div key={path} className="crm-page-transition flex min-w-0 flex-1 flex-col gap-4">{children}</div></div></SidebarInset></SidebarProvider>;
}
