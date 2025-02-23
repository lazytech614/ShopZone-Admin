import React from 'react'

import prismadb from '@/lib/prismadb'
import SizeForm from './components/SizeForm'

const Size = async ({params} : {params: {sizeId: string}}) => {
    const size = await prismadb.size.findUnique({
        where: {
            id: params.sizeId
        }
    })

  return (
    <div className='flex flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <SizeForm initialData={size}/>
        </div>
    </div>
  )
}

export default Size