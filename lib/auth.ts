import {TOKEN} from './api';
// The account menu is reused from New World Courtage; sessions remain FicheAssur's.
export function logout() {localStorage.removeItem(TOKEN); window.location.assign('/connexion');}
