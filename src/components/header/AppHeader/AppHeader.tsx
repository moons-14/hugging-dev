import { appsData } from "@/appData/apps"
import { AppActions } from "../AppActions"
import { AppSelector } from "../AppSelector"
import { AppShare } from "../AppShare"
import Link from "next/link"
import { ApiKeySetting } from "../ApiKeySetting"

export const AppHeader = () => {
    return (
        <div className="container flex justify-between space-y-2 py-4 items-center sm:space-y-0 md:h-16">
            <Link href="/">
                <h2 className="text-lg font-semibold">
                    Hugging Dev
                </h2>
            </Link>
            <div className="ml-auto flex flex-1 space-x-2 justify-end">
                <div className="hidden space-x-2 md:flex">
                    <AppSelector appsData={appsData} />
                </div>
                <ApiKeySetting />
                <div className="hidden space-x-2 md:flex">
                    <AppShare />
                </div>
                <AppActions />
            </div>
        </div>
    )
}