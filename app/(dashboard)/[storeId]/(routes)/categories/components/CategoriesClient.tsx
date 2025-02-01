"use client"

import React from 'react'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
// import { BillboardColumn, columns } from '@/components/Columns'
import { CategoryColumn, columns } from './Columns'
import { DataTable } from '@/components/ui/dataTable'
import { ApiList } from '@/components/ui/apiList'

interface CategoriesClientProps {
    data: CategoryColumn[]
}

const CategoriesClient:React.FC<CategoriesClientProps> = ({data}) => {
    const router = useRouter()
    const params = useParams()

  return (
    <>
        <div className='flex items-center justify-between'>
            <Heading 
                title={`Categories (${data.length})`} 
                description='Manage categories for your store'
            />
            <Button
                onClick={() => router.push(`/${params.storeId}/categories/new`)}
                variant='outline'
            >
                <Plus className='mr-2 h-4 w-4' />
                Add New
            </Button>
        </div>
        <Separator />
        <DataTable 
            columns={columns} 
            data={data} 
            searchKey='name'
        />
        <Heading 
            title='API'
            description='API calls for Categories'
        />
        <Separator />
        <ApiList 
            entityName='categories'
            entityIdName='categoryId'
        />
    </>
  )
}

export default CategoriesClient