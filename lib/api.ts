export const API = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8100').replace(/\/+$/, '');
export const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3100').replace(/\/+$/, '');
export const TOKEN = 'ficheassur_management_token';
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = typeof window === 'undefined' ? null : localStorage.getItem(TOKEN);
  const response = await fetch(`${API}${path}`, {...init, headers: {'Content-Type': 'application/json', ...(token ? {Authorization: `Bearer ${token}`} : {}), ...init.headers}, cache: 'no-store'});
  if (!response.ok) {
    if (response.status === 401 && token) { localStorage.removeItem(TOKEN); window.dispatchEvent(new Event('crm-session-expired')); }
    const body = await response.json().catch(() => null);
    const message = Array.isArray(body?.detail) ? body.detail.map((d: {msg: string}) => d.msg.replace(/^Value error, /, '')).join(' · ') : body?.detail;
    throw new Error(typeof message === 'string' ? message : 'Le service est indisponible. Réessayez.');
  }
  return response.status === 204 ? undefined as T : response.json();
}
export type Page<T> = {items: T[]; total: number; page: number; limit: number; amount_cents?: number};
export type Client = {id: string; name: string; email: string; company: string; phone: string | null; orias_number: string | null; status: string; created_at: string; last_login_at: string | null; purchases: number; spent_cents: number; last_purchase_at: string | null; by_market?: {market: string; sales: number; spent_cents: number}[]};
export type Lead = {id: string; name: string; email: string; city: string; zip_code: string; market: string; created_at: string; sales: number; holds: number; availability: string};
export type Sale = {id: string; client_id: string; client_name: string; client_email: string; company: string; lead_id: string; lead_name: string; lead_email: string; market: string; city: string; exclusive: boolean; price_cents: number; purchased_at: string; order_id: string | null};
export type Block = {type: 'paragraph' | 'heading' | 'list'; text: string};
export type Article = {id?: string; title: string; slug: string; excerpt: string; category: string; kind: 'article' | 'guide'; status: 'draft' | 'published'; author_name: string; cover_url: string; cover_alt: string; seo_title: string; seo_description: string; blocks: Block[]; published_at?: string; updated_at?: string; reading_minutes?: number};
export type Summary = {clients: number; active_clients: number; purchasing_clients: number; sales: number; unique_leads_sold: number; revenue_cents: number; leads: number; inventory: Record<string, number>; articles: number; published_articles: number; by_market: {market: string; sales: number; revenue_cents: number}[]};
export const root = '/api/v1/admin/management';
export const markets: Record<string, string> = {AUTO: 'Auto', MOTO: 'Moto', AUTO_PRO: "Pro de l’automobile", COMMERCIAL_AUTO: 'Véhicules pro'};
export const statuses: Record<string, string> = {active: 'Actif', invited: 'Invité', disabled: 'Désactivé', available: 'Disponible', reserved: 'Réservé', sold_out: 'Épuisé', withdrawn: 'Retiré', expired: 'Expiré', unavailable: 'Non commercialisé', draft: 'Brouillon', published: 'Publié'};
export const money = (cents: number) => new Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'}).format(cents / 100);
export const date = (value?: string | null) => value ? new Intl.DateTimeFormat('fr-FR', {dateStyle: 'medium'}).format(new Date(value)) : '—';
export const imageUrl = (url: string) => url.startsWith('/') ? SITE + url : url;
export const categories = ['Développement du cabinet', 'Achat de leads', 'Assurance auto', 'Assurance moto', 'Pro de l’automobile', 'Véhicules pro'];
