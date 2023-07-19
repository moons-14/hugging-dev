'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CopyIcon } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function AppShare() {

    const [url, setUrl] = useState("")

    useEffect(() => {
        setUrl(window.location.href)
    }, [])

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="secondary">Share</Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[520px]">
                <div className="flex flex-col space-y-2 text-center sm:text-left">
                    <h3 className="text-lg font-semibold">Share App</h3>
                    <p className="text-sm text-muted-foreground">
                        Share the current URL.
                    </p>
                </div>
                <div className="flex items-center space-x-2 pt-4">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            Link
                        </Label>
                        <Input
                            id="link"
                            defaultValue={url}
                            readOnly
                            className="h-9"
                        />
                    </div>
                    <Button
                        type="submit" size="sm" className="px-3"
                        onClick={() => {
                            navigator.clipboard.writeText(url)
                        }}
                    >
                        <span className="sr-only">Copy</span>
                        <CopyIcon className="h-4 w-4" />
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}