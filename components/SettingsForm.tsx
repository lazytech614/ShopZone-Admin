"use client"

import React, {useState} from 'react'
import { Store } from '@prisma/client'
import { Trash } from 'lucide-react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'

import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AlertModal } from '@/components/modals/AlertModal'
import { ApiAlert } from '@/components/ui/apiAlert'
import { useOrigin } from '@/hooks/useOrigin'

interface SettingsFormProps {
    initialData: Store
}

const formSchema = z.object({
    name: z.string().min(1),
})

type SettingsFormValues = z.infer<typeof formSchema>

const SettingsForm: React.FC<SettingsFormProps> = ({initialData}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const params = useParams()
    const router = useRouter()

    const origin = useOrigin()

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    })

    const onSubmit = async (data: SettingsFormValues) => {
        try {
            setIsLoading(true)
            console.log("StoreId", params.storeId);
            await axios.patch(`/api/stores/${params.storeId}`, data)
            router.refresh()
            toast.success("Store updated successfully.")
        }catch(err) {
            toast.error("Something went wrong.")
        }finally{
            setIsLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setIsLoading(true)
            await axios.delete(`/api/stores/${params.storeId}`)
            router.refresh()
            router.push('/')
            toast.success("Store deleted successfully.")
        }catch(err) {
            toast.error("Make sure you removed all products and categories first.")
        }finally {
            setIsOpen(false)
            setIsLoading(false)
        }
    }

  return (
    <>
        <AlertModal 
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onConfirm={onDelete}
            isLoading={isLoading}
        />
        <div className='flex items-center justify-between'>
            <Heading 
                title='Settings' 
                description='Manage store preferences'
            />
            <Button
                disabled={isLoading}
                variant={'destructive'}
                size={'icon'}
                onClick={() => {setIsOpen(true)}}
            >
                <Trash className='w-4 h-4' />
            </Button>
        </div>
        <Separator />
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-8 w-full'
            >
                <div className='grid grid-cols-3 gap-8'>
                    <FormField
                        control={form.control}
                        name='name'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Name
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        disabled={isLoading}
                                        placeholder='Store name'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button
                    disabled={isLoading}
                    className='ml-auto'
                    type='submit'
                >
                    Save changes
                </Button>
            </form>
        </Form>
        <Separator />
        <ApiAlert 
            title='NEXT_PUBLIC_API_URL'
            description={`${origin}/api/${params.storeId}`}
            variant='public'
        />
    </>
  )
}

export default SettingsForm