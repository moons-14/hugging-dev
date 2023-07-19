"use client"

import * as React from "react"
import { Dialog } from "@radix-ui/react-dialog"

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { useSettingStore } from "@/stores/settingStore"

export function AppActions() {
    const [open, setIsOpen] = React.useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
    const { useChatGptAssist, setUseChatGptAssist } = useSettingStore()

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary">
                        <span className="sr-only">Actions</span>
                        <DotsHorizontalIcon className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setIsOpen(true)}>
                        User Preferences
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onSelect={() => setShowDeleteDialog(true)}
                        className="text-red-600"
                    >
                        Report an app
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={open} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>User Preferences</DialogTitle>
                        <DialogDescription>
                            User-specific settings can be configured.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6">
                        <h4 className="text-sm text-muted-foreground">
                            Beta Features
                        </h4>
                        <div className="flex items-start justify-between space-x-4 pt-3">
                            <Switch
                                name="show"
                                id="show"
                                defaultChecked={useChatGptAssist}
                                onCheckedChange={setUseChatGptAssist}
                            />
                            <Label className="grid gap-1 font-normal" htmlFor="show">
                                <span className="font-semibold">
                                    Enable ChatGPT assist
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    You can perform operations within the application in a chat format.
                                    An OpenAI API key must be set for execution.
                                </span>
                            </Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setIsOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Having trouble with your application?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Please feel free to contact us if you have any problems or comments with the application.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button
                            variant="link"
                            onClick={() => {
                                setShowDeleteDialog(false)
                                window.open("https://twitter.com/moons_dev")
                            }}
                        >
                            @moons_dev
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}