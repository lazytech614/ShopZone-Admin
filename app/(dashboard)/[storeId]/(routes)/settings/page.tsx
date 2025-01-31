import { auth } from '@clerk/nextjs/server'
import React from 'react'
import { redirect } from 'next/navigation'

import prismadb from '@/lib/prismadb'
import SettingsForm from '@/components/SettingsForm'

interface StoreSettingsPageProps {
    params: {
        storeId: string
    }
}

const StoreSettingsPage: React.FC<StoreSettingsPageProps> = async ({params}) => {
    const {userId} = await auth();

    if(!userId) redirect("/sign-in")

    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId
        }
    })  

    if(!store) redirect("/")

  return (
    <div className='flex flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <SettingsForm initialData={store}/>
        </div>
    </div>
  )
}

export default StoreSettingsPage