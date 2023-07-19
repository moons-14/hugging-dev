import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'

export const useHistoryStore = create
    (persist
        <{
            history: string[],
            setHistory: (history: string[]) => void,
        }>
        ((set, get) => ({
            history: [],
            setHistory: (history) => set({ history: history }),
        }), {
            name: 'history-storage',
            storage: createJSONStorage(() => sessionStorage),
        }))