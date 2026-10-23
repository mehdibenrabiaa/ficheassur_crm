'use client';
import {useEffect, useRef} from 'react';
import {useToastManager} from '@/components/ui/toast';

// Keep transient messages in a persistent, dismissible notification viewport.
export function PopupNotice({message, title, type = 'error'}: {message: string; title: string; type?: 'success' | 'error'}) {
  const manager = useToastManager();
  const seen = useRef('');
  useEffect(() => {
    if (!message) {seen.current = ''; return;}
    if (seen.current === message) return;
    seen.current = message;
    manager.add({title, description: message, type, timeout: type === 'error' ? 10000 : 5000});
  }, [message, title, type, manager]);
  return null;
}
