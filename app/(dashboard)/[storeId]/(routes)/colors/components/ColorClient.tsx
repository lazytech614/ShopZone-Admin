"use client"

import React from 'react'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ColorColumn, columns } from './Columns'
import { DataTable } from '@/components/ui/dataTable'
import { ApiList } from '@/components/ui/apiList'

interface ColorClientProps {
    data: ColorColumn[]
}

const ColorClient:React.FC<ColorClientProps> = ({data}) => {
    const router = useRouter()
    const params = useParams()

  return (
    <>
        <div className='flex items-center justify-between'>
            <Heading 
                title={`Colors (${data.length})`} 
                description='Manage colors for your store'
            />
            <Button
                onClick={() => router.push(`/${params.storeId}/colors/new`)}
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
            description='API calls for colors'
        />
        <Separator />
        <ApiList 
            entityName='colors'
            entityIdName='colorId'
        />
    </>
  )
}

export default ColorClient