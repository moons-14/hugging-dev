import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Inference API Tester | Hugging Dev',
    description: 'Playground of the Inference API provided by Hugging Face / We aim to create a tool that makes it easier to take advantage of the APIs provided by Hugging Face',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}