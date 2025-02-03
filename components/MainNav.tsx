"use client"

import React from 'react'
import { useParams, usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from './ui/dropdown-menu'
import { MenuIcon } from 'lucide-react'

const MainNav = ({className} : React.HTMLAttributes<HTMLDivElement>) => {
    const pathname = usePathname()
    const params = useParams()

    const routes = [
        {
            href: `/${params.storeId}`,
            label: 'Overview',
            active: pathname === `/${params.storeId}`
        },
        {
            href: `/${params.storeId}/billboards`,
            label: 'Billboards',
            active: pathname === `/${params.storeId}/billboards`
        },
        {
            href: `/${params.storeId}/categories`,
            label: 'Categories',
            active: pathname === `/${params.storeId}/categories`
        },
        {
          href: `/${params.storeId}/sizes`,
          label: 'Sizes',
          active: pathname === `/${params.storeId}/sizes`
        },
        {
          href: `/${params.storeId}/colors`,
          label: 'Colors',
          active: pathname === `/${params.storeId}/colors`
        },
        {
            href: `/${params.storeId}/products`,
            label: 'products',
            active: pathname === `/${params.storeId}/products`
        },
        {
            href: `/${params.storeId}/orders`,
            label: 'orders',
            active: pathname === `/${params.storeId}/orders`
        },
        {
            href: `/${params.storeId}/settings`,
            label: 'Settings',
            active: pathname === `/${params.storeId}/settings`
        },
    ]

  return (
    <nav className='flex justify-end flex-1 pr-2 lg:block lg:pr-0'>
        <div className={cn("hidden lg:flex items-center space-x-4", className)}>
          {routes.map(route => (
            <Link 
              key={route.href}
              href={route.href}
              className={cn("capitalize text-sm font-medium transition-colors hover:text-primary", route.active ? "text-black dark:text-white" : "text-muted-foreground")}
            >
              {route.label}
            </Link>
          ))}
        </div>
        <div className='lg:hidden'>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MenuIcon className='w-6 h-6' />
            </DropdownMenuTrigger>
            <DropdownMenuContent className='flex flex-col gap-y-2 p-4'>
              {routes.map(route => (
                <Link 
                  key={route.href}
                  href={route.href}
                  className={cn("capitalize text-sm font-medium transition-colors hover:text-primary", route.active ? "text-black dark:text-white" : "text-muted-foreground")}
                >
                  {route.label}
                </Link>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
    </nav>
  )
}

export default MainNav