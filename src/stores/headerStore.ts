import { AppData } from "@/appData/apps";
import { create } from "zustand";

export const useHeaderStore = create<{
    useApp: AppData | null,
    setUseApp: (app: AppData | null) => void,
}>((set) => ({
    useApp: null,
    setUseApp: (app) => set({ useApp: app }),
}))