import { UserButton } from '@clerk/nextjs'
import React from 'react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import MainNav from '@/components/MainNav'
import StoreSwitcher from '@/components/StoreSwitcher'
import prismadb from '@/lib/prismadb'

const Navbar = async() => {
  const {userId} = await auth();

  if(!userId) redirect("/sign-in")

  const stores = await prismadb.store.findMany({
    where: {
        userId
    }
  })

  return (
    <div className='h-16 border-b px-4 flex items-center gap-2'>
        <StoreSwitcher items={stores}/>
        <MainNav />
        <div className='ml-auto'>
            <UserButton />
        </div>
    </div>
  )
}

export default Navbar