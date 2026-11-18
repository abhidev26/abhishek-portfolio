import { store } from './store';

export type ToastKind = 'success' | 'error' | 'info';
export interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

const toastListeners = new Set<(t: ToastItem) => void>();
let toastId = 0;

export function toast(kind: ToastKind, message: string): void {
  const item: ToastItem = { id: ++toastId, kind, message };
  toastListeners.forEach((l) => l(item));
}
export function subscribeToasts(fn: (t: ToastItem) => void): () => void {
  toastListeners.add(fn);
  return () => {
    toastListeners.delete(fn);
  };
}

export const OPEN_PROJECT_EVENT = 'nexus:open-project';
export function openProject(id: string): void {
  window.dispatchEvent(new CustomEvent<string>(OPEN_PROJECT_EVENT, { detail: id }));
}

export function scrollToSection(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  if (store.lenis) {
    store.lenis.scrollTo(el, { duration: 1.8, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function scrollToTop(): void {
  if (store.lenis) store.lenis.scrollTo(0, { duration: 2 });
  else window.scrollTo({ top: 0, behavior: 'smooth' });
}
