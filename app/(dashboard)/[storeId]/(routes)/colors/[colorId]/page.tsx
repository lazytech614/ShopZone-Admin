import React from 'react'

import prismadb from '@/lib/prismadb'
import SizeForm from './components/ColorForm'

const Size = async ({params} : {params: {colorId: string}}) => {
    const color = await prismadb.color.findUnique({
        where: {
            id: params.colorId
        }
    })

  return (
    <div className='flex flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <SizeForm initialData={color}/>
        </div>
    </div>
  )
}

export default Size