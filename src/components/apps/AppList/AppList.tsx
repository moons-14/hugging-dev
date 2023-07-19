import { appsData } from "@/appData/apps"
import { Card, CardHeader } from "@/components/ui/card"
import Link from "next/link"

export const AppList = () => {
    return (<>
        <div className="flex flex-wrap gap-6 text-center">
            {
                appsData.map((app) => {
                    return (<>
                        <div>
                            <Link href={"/apps/" + app.id}>
                                <Card className="w-auto">
                                    <CardHeader>
                                        <h3 className="text-lg font-semibold">{app.name}</h3>
                                    </CardHeader>
                                </Card>
                            </Link>
                        </div>
                    </>)
                })
            }
        </div>
    </>)
}