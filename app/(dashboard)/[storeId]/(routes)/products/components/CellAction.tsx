"use client"

import React, {useState} from 'react'
import { 
    Copy, 
    Edit, 
    MoreHorizontal, 
    Trash 
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

import { ProductColumn } from './Columns'
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useParams, useRouter } from 'next/navigation'
import { AlertModal } from '@/components/modals/AlertModal'

interface CellActionProps {
    data: ProductColumn
}

const CellAction:React.FC<CellActionProps> = ({data}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const router = useRouter()
    const params = useParams()

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id)
        toast.success("Product ID copied to clipboard.")
    }

    const onDelete = async () => {
        try {
            setIsLoading(true)
            await axios.delete(`/api/${params.storeId}/products/${data.id}`)
            router.refresh()
            router.push(`/${params.storeId}/products`)
            toast.success("Product deleted successfully.")
        }catch(err) {
            toast.error("Something went wrong.")
        }finally {
            setIsOpen(false)
            setIsLoading(false)
        }
    }

  return (
    <>
        <AlertModal 
            isOpen={isOpen}
            isLoading={isLoading}
            onClose={() => setIsOpen(false)}
            onConfirm={onDelete}
        />
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='ghost'
                    className='h-8 w-8 p-0'
                >
                    <span   className='sr-only'>
                        Open menu
                    </span>
                    <MoreHorizontal className='h-4 w-4' />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuLabel>
                    Actions
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/products/${data.id}`)}>
                    <Edit className='mr-2 h-4 w-4' />
                    Update
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onCopy(data.id)}>
                    <Copy className='mr-2 h-4 w-4' />
                    Copy ID
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsOpen(true)}>
                    <Trash className='mr-2 h-4 w-4' />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </>
  )
}

export default CellAction