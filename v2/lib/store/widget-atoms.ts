import { atom } from "jotai";

export const widgetVisibleAtom = atom(false);
export const widgetTokenAtom = atom<string | null>(null);
