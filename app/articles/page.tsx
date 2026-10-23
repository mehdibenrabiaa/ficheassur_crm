'use client';
import ThemedSelect from '@/components/ThemedSelect';
import {Input} from '@/components/ui/input';
import {useState} from 'react';
import Link from 'next/link';
import {date, type Article, type Page} from '@/lib/api';
import {useLoad, useDebounce, Title, State, Table, Badge, Pagination} from '@/components/UI';
export default function Articles() {
  const [q, setQ] = useState(''); const debounced = useDebounce(q); const [status, setStatus] = useState(''); const [page, setPage] = useState(1);
  const load = useLoad<Page<Article & {id: string}>>(`/api/v1/admin/articles?${new URLSearchParams({q: debounced, ...(status && {status}), page: String(page)})}`);
  return <><Title title="Articles & guides" description="Construisez vos contenus et publiez-les dans les ressources du site FicheAssur." action={<Link className="primary" href="/articles/new">+ Nouvel article</Link>} /><section className="panel"><div className="filters"><label className="search">Rechercher un contenu<Input placeholder="Titre de l’article…" value={q} onChange={e => {setQ(e.target.value); setPage(1);}} /></label><label>Publication<ThemedSelect label="Publication" value={status} onValueChange={value => {setStatus(value); setPage(1);}} options={[{value: '', label: 'Tous les contenus'}, {value: 'draft', label: 'Brouillons'}, {value: 'published', label: 'Publiés'}]} /></label></div><State {...load} retry={load.reload} />{load.data && <><Table rows={load.data.items} empty="Créez votre premier article ou guide. Les brouillons ne sont pas visibles sur le site." columns={[{title: 'Titre', render: a => <><Link className="row-link" href={`/articles/${a.id}`}>{a.title}</Link><small>/articles-et-guides/{a.slug}</small></>}, {title: 'Type', render: a => a.kind === 'guide' ? 'Guide' : 'Article'}, {title: 'Catégorie', render: a => a.category}, {title: 'Statut', render: a => <Badge value={a.status} />}, {title: 'Auteur', render: a => a.author_name}, {title: 'Mis à jour', render: a => date(a.updated_at)}, {title: 'Éditer', render: a => <Link href={`/articles/${a.id}`}>Ouvrir →</Link>}]} /><Pagination data={load.data} setPage={setPage} /></>}</section></>;
}
