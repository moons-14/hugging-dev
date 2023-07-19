import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'

export const useSettingStore = create
    (persist
        <{
            useChatGptAssist: boolean,
            setUseChatGptAssist: (use: boolean) => void,
            openAiApiKey: string,
            setOpenAiApiKey: (key: string) => void,
            huggingFaceApiKey: string,
            setHuggingFaceApiKey: (key: string) => void,
        }>
        ((set, get) => ({
            useChatGptAssist: false,
            setUseChatGptAssist: (use) => set({ useChatGptAssist: use }),
            openAiApiKey: "",
            setOpenAiApiKey: (key) => set({ openAiApiKey: key }),
            huggingFaceApiKey: "",
            setHuggingFaceApiKey: (key) => set({ huggingFaceApiKey: key }),
        }), {
            name: 'setting-storage',
            storage: createJSONStorage(() => sessionStorage),
        }))