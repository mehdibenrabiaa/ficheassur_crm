'use client';
import {FilePenLineIcon} from 'lucide-react';
import {AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction} from '@/components/ui/alert-dialog';

export default function LeaveArticleDialog({open, onOpenChange, onLeave}: {open: boolean; onOpenChange: (open: boolean) => void; onLeave: () => void}) {
  return <AlertDialog open={open} onOpenChange={onOpenChange}><AlertDialogContent><AlertDialogHeader><span className="mb-2 flex size-11 items-center justify-center bg-accent text-primary"><FilePenLineIcon className="size-5" /></span><AlertDialogTitle>Quitter l’article ?</AlertDialogTitle><AlertDialogDescription>Vos dernières modifications n’ont pas été enregistrées. Vous pouvez continuer la rédaction ou quitter sans les conserver.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Continuer la rédaction</AlertDialogCancel><AlertDialogAction onClick={onLeave}>Quitter sans enregistrer</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>;
}
