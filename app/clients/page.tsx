'use client';
import ThemedSelect from '@/components/ThemedSelect';
import {Input} from '@/components/ui/input';
import {useState} from 'react';
import Link from 'next/link';
import {root, date, money, type Client, type Page} from '@/lib/api';
import {useLoad, useDebounce, Title, State, Table, Badge, Pagination} from '@/components/UI';
export default function Clients() {
  const [q, setQ] = useState(''); const debounced = useDebounce(q); const [status, setStatus] = useState(''); const [page, setPage] = useState(1);
  const load = useLoad<Page<Client>>(`${root}/clients?${new URLSearchParams({q: debounced, ...(status && {status}), page: String(page)})}`);
  return <><Title title="Comptes clients" description="Les courtiers inscrits sur FicheAssur, avec ou sans achat. Les comptes administrateurs sont exclus." /><section className="panel"><div className="filters"><label className="search">Rechercher un client<Input placeholder="Nom, société ou email…" value={q} onChange={e => {setQ(e.target.value); setPage(1);}} /></label><label>Statut<ThemedSelect label="Statut" value={status} onValueChange={value => {setStatus(value); setPage(1);}} options={[{value: '', label: 'Tous les comptes'}, {value: 'active', label: 'Actifs'}, {value: 'invited', label: 'Invités'}, {value: 'disabled', label: 'Désactivés'}]} /></label></div><State {...load} retry={load.reload} />{load.data && <><Table rows={load.data.items} empty="Les inscriptions des courtiers apparaîtront ici." columns={[{title: 'Client', render: c => <><Link className="row-link" href={`/clients/${c.id}`}>{c.name}</Link><small>{c.email}</small></>}, {title: 'Société', render: c => <>{c.company}<small>ORIAS : {c.orias_number || 'Non renseigné'}</small></>}, {title: 'Statut', render: c => <Badge value={c.status} />}, {title: 'Inscription', render: c => date(c.created_at)}, {title: 'Leads achetés', render: c => c.purchases}, {title: 'Total achats', render: c => money(c.spent_cents)}, {title: 'Rapport', render: c => <Link href={`/clients/${c.id}`}>Voir le rapport →</Link>}]} /><Pagination data={load.data} setPage={setPage} /></>}</section></>;
}
