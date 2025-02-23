"use client"

import React from 'react'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { BillboardColumn, columns } from './Columns'
import { DataTable } from '@/components/ui/dataTable'
import { ApiList } from '@/components/ui/apiList'

interface BillboardClientProps {
    data: BillboardColumn[]
}

const BillboardClient:React.FC<BillboardClientProps> = ({data}) => {
    const router = useRouter()
    const params = useParams()

  return (
    <>
        <div className='flex items-center justify-between'>
            <Heading 
                title={`Billboards (${data.length})`} 
                description='Manage billboards for your store'
            />
            <Button
                onClick={() => router.push(`/${params.storeId}/billboards/new`)}
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
            searchKey='label'
        />
        <Heading 
            title='API'
            description='API calls for Billboards'
        />
        <Separator />
        <ApiList 
            entityName='billboards'
            entityIdName='billboardId'
        />
    </>
  )
}

export default BillboardClient