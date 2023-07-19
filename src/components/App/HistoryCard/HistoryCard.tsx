import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useHistoryStore } from "@/stores/historyStore"

export const HistoryCard = ({
    onClick
}: {
    onClick: (string: string) => void
}) => {

    const {
        history,
        setHistory
    } = useHistoryStore()

    if (history.length === 0) return (<></>)
    return (<div className="w-full text-center">
        <Card>
            <CardHeader className="text-center">
                History
            </CardHeader>
            <CardContent>
                <div className="space-y-2 text-center w-full">
                    {
                        history.map((item, index) => {
                            return (<>
                                <div key={index} className="text-center cursor-pointer"
                                    onClick={() => {
                                        onClick(item)
                                        setHistory([item, ...history.filter((historyItem) => historyItem !== item).slice(0, 20)])
                                    }}
                                >
                                    <div>
                                        {item}
                                    </div>
                                </div>
                                {
                                    index !== history.length - 1 && <Separator />
                                }
                            </>)

                        })
                    }
                </div>
            </CardContent>
            <CardFooter className="flex justify-center">
                <Button variant="ghost"
                    onClick={() => {
                        setHistory([])
                    }}
                >
                    Remove All History
                </Button>
            </CardFooter>
        </Card>
    </div>)
}