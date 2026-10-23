'use client';
import ThemedSelect from '@/components/ThemedSelect';
import {Input} from '@/components/ui/input';
import {useState} from 'react';
import {useSearchParams} from 'next/navigation';
import Link from 'next/link';
import {root, markets, statuses, date, type Lead, type Page} from '@/lib/api';
import Sales from '@/components/Sales';
import {useLoad, useDebounce, Title, State, Table, Badge, Pagination} from '@/components/UI';
export default function Leads() {
  const params = useSearchParams(); const selected = params.get('lead'); const [q, setQ] = useState(''); const debounced = useDebounce(q); const [market, setMarket] = useState(''); const [availability, setAvailability] = useState(''); const [page, setPage] = useState(1);
  const load = useLoad<Page<Lead>>(selected ? null : `${root}/leads?${new URLSearchParams({q: debounced, ...(market && {market}), ...(availability && {availability}), page: String(page)})}`);
  if (selected) return <><Link className="back" href="/leads">← Tous les leads</Link><Title title="Acheteurs du lead" description={`Historique des ventes · Référence ${selected}`} /><Sales leadId={selected} /></>;
  return <><Title title="Inventaire des leads" description="Suivez les disponibilités, les réservations et les ventes de chaque lead." /><section className="panel"><div className="filters"><label className="search">Rechercher<Input placeholder="Nom, email ou ville…" value={q} onChange={e => {setQ(e.target.value); setPage(1);}} /></label><label>Marché<ThemedSelect label="Marché" value={market} onValueChange={value => {setMarket(value); setPage(1);}} options={[{value: '', label: 'Tous les marchés'}, ...Object.entries(markets).map(([value, label]) => ({value, label}))]} /></label><label>Disponibilité<ThemedSelect label="Disponibilité" value={availability} onValueChange={value => {setAvailability(value); setPage(1);}} options={[{value: '', label: 'Tous les leads'}, ...['available', 'reserved', 'sold_out', 'withdrawn', 'expired', 'unavailable'].map(value => ({value, label: statuses[value]}))]} /></label></div><State {...load} retry={load.reload} />{load.data && <><Table rows={load.data.items} empty="Aucun lead ne correspond à votre sélection." columns={[{title: 'Prospect', render: l => <><Link className="row-link" href={`/leads?lead=${l.id}`}>{l.name}</Link><small>{l.email}</small></>}, {title: 'Marché', render: l => markets[l.market] || l.market}, {title: 'Localisation', render: l => <>{l.city}<small>{l.zip_code}</small></>}, {title: 'Créé le', render: l => date(l.created_at)}, {title: 'Disponibilité', render: l => <Badge value={l.availability} />}, {title: 'Ventes', render: l => <Link href={`/leads?lead=${l.id}`}>{l.sales} acheteur{l.sales === 1 ? '' : 's'} →</Link>}, {title: 'Réservations', render: l => l.holds}]} /><Pagination data={load.data} setPage={setPage} /></>}</section></>;
}
