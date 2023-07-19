import { Error404 } from '@/components/error'
import { RootLayoutComponent } from './layout'

export default function NotFound() {
    return (
        <>
            <RootLayoutComponent>
                <Error404 />
            </RootLayoutComponent>
        </>
    )
}