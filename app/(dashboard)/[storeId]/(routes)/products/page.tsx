import React from 'react'
import { format } from 'date-fns'

import prismadb from '@/lib/prismadb'
import { ProductColumn } from './components/Columns'
import ProductClient from './components/ProductClient'
import { formattorPrice } from '@/lib/utils'

const ProductsPage = async ({params}: {params: {storeId: string}}) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      category: true,
      size: true,
      color: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const formattedProducts:ProductColumn[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    price: formattorPrice(product.price.toNumber()),
    category: product.category.name,
    size: product.size.name,
    color: product.color.value,
    quantity: product.quantity,
    material: product.material,
    brand: product.brand,
    createdAt: format(product.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <div className='flex flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ProductClient data={formattedProducts}/>
      </div>
    </div>
  )
}

export default ProductsPage