import { PresetActions } from "../PresetActions"
import { PresetShare } from "../PresetShare"

export const AppHeader = () => {
    return (
        <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
            <h2 className="text-lg font-semibold">Playground</h2>
            <div className="ml-auto flex w-full space-x-2 sm:justify-end">
                {/* <PresetSelector presets={presets} />
            <PresetSave /> */}
                <div className="hidden space-x-2 md:flex">
                    {/* <CodeViewer /> */}
                    <PresetShare />
                </div>
                <PresetActions />
            </div>
        </div>
    )
}