'use client';
import {useParams} from 'next/navigation';
import Link from 'next/link';
import {root, date, money, markets, type Client} from '@/lib/api';
import Sales from '@/components/Sales';
import {useLoad, Title, State, Stat, Badge} from '@/components/UI';
export default function ClientReport() {
  const {id} = useParams<{id: string}>(); const load = useLoad<Client>(`${root}/clients/${id}`); const c = load.data;
  return <><Link className="back" href="/clients">← Comptes clients</Link><Title title={c?.name || 'Rapport client'} description={c ? `${c.company} · ${c.email}` : 'Historique des achats et informations du compte.'} /><State {...load} retry={load.reload} />{c && <><div className="stats"><Stat label="Leads achetés" value={c.purchases} hint="Historique complet" /><Stat label="Total des achats" value={money(c.spent_cents)} /><Stat label="Dernier achat" value={date(c.last_purchase_at)} /><Stat label="Compte créé le" value={date(c.created_at)} /></div><section className="panel client-info"><div><span>État du compte</span><Badge value={c.status} /></div><div><span>Téléphone</span><strong>{c.phone || '—'}</strong></div><div><span>Numéro ORIAS</span><strong>{c.orias_number || '—'}</strong></div><div><span>Dernière connexion</span><strong>{date(c.last_login_at)}</strong></div></section>{!!c.by_market?.length && <section className="panel"><h2>Achats par marché</h2><div className="market-rows">{c.by_market.map(m => <div key={m.market}><strong>{markets[m.market] || m.market}</strong><span>{m.sales} achats</span><span>{money(m.spent_cents)}</span></div>)}</div></section>}<h2 className="section-title">Historique des achats</h2><Sales clientId={id} /></>}</>;
}
