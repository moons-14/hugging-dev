import { Error404 } from '@/components/error'
import { RootLayoutComponent } from './layout'

export const runtime = 'edge';
export default function NotFound() {
    return (
        <>
            <RootLayoutComponent>
                <Error404 />
            </RootLayoutComponent>
        </>
    )
}