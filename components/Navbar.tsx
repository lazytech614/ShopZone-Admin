import { UserButton } from '@clerk/nextjs'
import React from 'react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import MainNav from '@/components/MainNav'
import StoreSwitcher from '@/components/StoreSwitcher'
import prismadb from '@/lib/prismadb'
import { ModeToggle } from '@/components/ThemeToggleButton'

const Navbar = async() => {
  const {userId} = await auth();

  if(!userId) redirect("/sign-in")

  const stores = await prismadb.store.findMany({
    where: {
        userId
    }
  })

  return (
    <div className='h-16 border-b px-8 flex items-center gap-2'>
        <StoreSwitcher items={stores}/>
        <MainNav />
        <div className='ml-auto flex items-center space-x-4'>
            <ModeToggle />
            <UserButton />
        </div>
    </div>
  )
}

export default Navbar