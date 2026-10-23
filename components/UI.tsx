'use client';
import {useEffect, useState} from 'react';
import {UsersIcon, ShoppingBagIcon, ReceiptTextIcon, BadgeEuroIcon, ActivityIcon} from 'lucide-react';
import {api, type Page, statuses} from '@/lib/api';
import {Button} from '@/components/ui/button';
import {PopupNotice} from '@/components/PopupNotice';
import {Table as DataTable, TableHeader, TableBody, TableRow, TableHead, TableCell} from '@/components/ui/table';

export function useLoad<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null); const [error, setError] = useState(''); const [loading, setLoading] = useState(true); const [revision, setRevision] = useState(0);
  useEffect(() => {let active = true; setLoading(true); setError(''); setData(null); if (!path) {setLoading(false); return;}
    api<T>(path).then(d => {if (active) setData(d);}).catch(e => {if (active) setError(e.message);}).finally(() => {if (active) setLoading(false);}); return () => {active = false;};
  }, [path, revision]);
  return {data, error, loading, reload: () => setRevision(r => r + 1)};
}
export function useDebounce(value: string) {const [debounced, setDebounced] = useState(value); useEffect(() => {const id = setTimeout(() => setDebounced(value), 250); return () => clearTimeout(id);}, [value]); return debounced;}
export function Title({title, description, action}: {eyebrow?: string; title: string; description: string; action?: React.ReactNode}) {return <div className="page-title"><div><h1>{title}</h1><p>{description}</p></div>{action}</div>;}
export function Stat({label, value, hint}: {label: string; value: React.ReactNode; hint?: string}) {
  const Icon = label.includes('clients') || label.includes('Clients') ? UsersIcon : label.includes('Montant') || label.includes('Total') ? BadgeEuroIcon : label.includes('Ventes') ? ReceiptTextIcon : label.includes('acheté') ? ShoppingBagIcon : ActivityIcon;
  return <div className="stat"><div className="stat-label"><span>{label}</span><span className="stat-icon"><Icon className="size-4" /></span></div><strong>{value}</strong>{hint && <small>{hint}</small>}</div>;
}
export function Badge({value}: {value: string}) {return <span className={`badge ${value}`}>{statuses[value] || value}</span>;}
export function State({error, loading, retry}: {error: string; loading: boolean; retry: () => void}) {return error ? <><PopupNotice message={error} title="Chargement impossible" /><div className="empty"><p>Les données n’ont pas pu être chargées.</p><Button variant="outline" onClick={retry}>Réessayer</Button></div></> : loading ? <div className="loading" role="status">Chargement des données…</div> : null;}
export function Table<T extends {id: string}>({rows, columns, empty}: {rows: T[]; columns: {title: string; render: (row: T) => React.ReactNode}[]; empty: string}) {return <DataTable><TableHeader><TableRow>{columns.map(c => <TableHead key={c.title}>{c.title}</TableHead>)}</TableRow></TableHeader><TableBody>{rows.length ? rows.map(row => <TableRow key={row.id}>{columns.map(c => <TableCell key={c.title}>{c.render(row)}</TableCell>)}</TableRow>) : <TableRow><TableCell colSpan={columns.length}><div className="empty"><strong>Aucun résultat</strong><p>{empty}</p></div></TableCell></TableRow>}</TableBody></DataTable>;}
export function Pagination({data, setPage}: {data: Pick<Page<unknown>, 'total' | 'page' | 'limit'>; setPage: (page: number) => void}) {const pages = Math.max(1, Math.ceil(data.total / data.limit)); return <div className="pagination"><span>{data.total} résultat{data.total === 1 ? '' : 's'} · Page {data.page} / {pages}</span><div><Button variant="outline" size="sm" disabled={data.page <= 1} onClick={() => setPage(data.page - 1)}>Précédent</Button><Button variant="outline" size="sm" disabled={data.page >= pages} onClick={() => setPage(data.page + 1)}>Suivant</Button></div></div>;}
