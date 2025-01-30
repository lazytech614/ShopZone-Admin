"use client"

import { StoreModal } from "@/components/modals/StoreModal"
import { useEffect, useState } from "react"

export const StoreModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if(!isMounted) return null;

    return (
        <>
            <StoreModal />
        </>
    )
}