import { AppHeader } from "@/components/header"
import { Toaster } from "@/components/ui/toaster"

export const RootLayoutComponent = ({
    children,
}: {
    children: React.ReactNode
}) => {
    return (
        <>
            <AppHeader />
            <div className="container mx-auto px-4 ">
                {children}
            </div>
            <Toaster />
        </>
    )
}