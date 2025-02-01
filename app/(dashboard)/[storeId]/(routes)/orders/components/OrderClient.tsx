"use client"

import React from 'react'

import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { OrderColumn, columns } from './Columns'
import { DataTable } from '@/components/ui/dataTable'

interface OrderClientProps {
    data: OrderColumn[]
}

const OrderClient:React.FC<OrderClientProps> = ({data}) => {
  return (
    <>
        <Heading 
            title={`Orders (${data.length})`} 
            description='Manae orders for yourstore'
        />
        <Separator />
        <DataTable 
            columns={columns} 
            data={data} 
            searchKey='products'
        />
    </>
  )
}

export default OrderClient