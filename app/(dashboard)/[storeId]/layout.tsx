import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

import prismadb from '@/lib/prismadb'
import Navbar from '@/components/Navbar'

const DashboardLayout = async ({children, params} : {
    children: React.ReactNode,
    params: {storeId: string}
}) => {
    const {userId} = await auth()

    if(!userId) redirect("/sign-in")

    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId
        }
    })

    if(!store) redirect("/")
  return (
    <>
        <Navbar />
        {children}
    </>
  )
}

export default DashboardLayout