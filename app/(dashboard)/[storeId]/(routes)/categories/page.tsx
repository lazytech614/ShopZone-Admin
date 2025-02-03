import React from 'react'

import prismadb from '@/lib/prismadb'
import { CategoryColumn } from './components/Columns'
import { format } from 'date-fns'
import CategoriesClient from './components/CategoriesClient'

const CategoriesPage = async ({params}: {params: {storeId: string}}) => {
    const categories = await prismadb.category.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const formattedCategories:CategoryColumn[] = categories.map((category: any) => ({
        id: category.id,
        name: category.name,
        // billboardLabel: category.billboard.label,
        createdAt: format(category.createdAt, 'MMMM do, yyyy'),
    }))

  return (
    <div className='flex flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <CategoriesClient data={formattedCategories}/>
      </div>
    </div>
  )
}

export default CategoriesPage