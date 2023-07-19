import { AppList } from "@/components/apps";

export const runtime = 'edge';
export default function Apps() {
    return (<>
        <h1 className="text-2xl font-semibold text-center my-6">Apps</h1>
        <AppList />
    </>)
}