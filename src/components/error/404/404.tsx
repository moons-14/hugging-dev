"use client"

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const Error404 = () => {
    return (
        <div className='flex items-center justify-center h-[80vh]'>
            <div className='text-center gap-8 grid'>
                <h2 className='text-4xl'>Not Found</h2>
                <p className='text-2xl'>Could not find requested resource</p>
                <Link href='/'>
                    <Button className='w-full'>
                        <a>Go Home</a>
                    </Button>
                </Link>
            </div>
        </div>
    )
}