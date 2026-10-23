'use client';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {api, SITE, TOKEN} from '@/lib/api';
import {PopupNotice} from '@/components/PopupNotice';
export default function Login() {
  const router = useRouter(); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {e.preventDefault(); setError(''); setBusy(true); try {const out = await api<{access_token: string; broker: {role: string}}>('/api/v1/auth/login', {method: 'POST', body: JSON.stringify({email, password})}); if (out.broker.role !== 'admin') throw new Error('Cet espace est réservé aux administrateurs FicheAssur.'); localStorage.setItem(TOKEN, out.access_token); router.replace('/dashboard');} catch (e) {setError((e as Error).message);} finally {setBusy(false);}}
  return <div className="login-page"><section className="login-intro"><img src="/brand/ficheassur-logo-white.svg" alt="FicheAssur" width="200" /><span className="eyebrow">ESPACE DE GESTION</span><h1>Votre activité.<br />Une vue d’ensemble.</h1><p>Les contenus du site, les leads, vos clients et vos ventes réunis dans votre CRM.</p><a href={SITE}>Retour au site ↗</a></section><section className="login-form"><form onSubmit={submit}><span className="eyebrow">FICHEASSUR CRM</span><h2>Connexion</h2><p>Connectez-vous avec votre compte administrateur.</p><label>Adresse email<Input type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} /></label><label>Mot de passe<Input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} /></label><PopupNotice message={error} title="Connexion impossible" /><Button type="submit" variant="default" className="primary" disabled={busy}>{busy ? 'Connexion…' : 'Se connecter →'}</Button></form></section></div>;
}
