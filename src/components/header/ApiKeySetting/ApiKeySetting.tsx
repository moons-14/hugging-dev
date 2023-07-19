"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSettingStore } from "@/stores/settingStore"

export function ApiKeySetting() {

    const {
        openAiApiKey,
        setOpenAiApiKey,
        huggingFaceApiKey,
        setHuggingFaceApiKey
    } = useSettingStore()

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary">API KEY
                    <div className="hidden space-x-2 sm:flex">
                        Setting
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[475px]">
                <DialogHeader>
                    <DialogTitle>API KEY Setting</DialogTitle>
                    <DialogDescription>
                        If you want to use a specific function, you need to set a specified API key.<br></br>
                        All APIs are used only for calling specified services and are managed in the browser. Service developers cannot read them.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="openai-api-key">OpenAI API KEY</Label>
                        <Input id="openai-api-key" autoFocus placeholder="OpenAI API KEY"
                            value={openAiApiKey}
                            onChange={(e) => setOpenAiApiKey(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="hugging-face-api-key">Hugging Face API KEY</Label>
                        <Input id="hugging-face-api-key" placeholder="Hugging Face API KEY"
                            value={huggingFaceApiKey}
                            onChange={(e) => setHuggingFaceApiKey(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}