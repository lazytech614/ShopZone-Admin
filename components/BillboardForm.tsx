"use client"

import React, {useState} from 'react'
import { Billboard } from '@prisma/client'
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
import { ImageUpload } from '@/components/ui/imageUpload'

const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1),
})

type BillboardFormValues = z.infer<typeof formSchema>

interface BillboardFormProps {
    initialData: Billboard | null
}
const BillboardForm: React.FC<BillboardFormProps> = ({initialData}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const params = useParams()
    const router = useRouter()

    const title = initialData ? "Edit billboard" : "Create billboard"
    const description = initialData ? "Edit billboard" : "Add a new billboard"
    const toastMessage = initialData ? "Billboard updated successfully." : "Billboard created successfully."
    const action = initialData ? "Save changes" : "Create"

    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: "",
            imageUrl: "",
        }
    })

    const onSubmit = async (data: BillboardFormValues) => {
        try {
            setIsLoading(true)
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data)
            }else {
                await axios.post(`/api/${params.storeId}/billboards`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/billboards`)
            toast.success(toastMessage)
        }catch(err) {
            toast.error("Something went wrong.")
        }finally{
            setIsLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setIsLoading(true)
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
            router.refresh()
            router.push('/')
            toast.success("Billboard deleted successfully.")
        }catch(err) {
            toast.error("Make sure you removed all products and categories using this billboard.")
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
                title={title} 
                description={description}
            />
            {initialData && (
                <Button
                    disabled={isLoading}
                    variant={'destructive'}
                    size={'icon'}
                    onClick={() => {setIsOpen(true)}}
                >
                    <Trash className='w-4 h-4' />
                </Button>
            )}
        </div>
        <Separator />
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-8 w-full'
            >
                <FormField
                    control={form.control}
                    name='imageUrl'
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Background image
                            </FormLabel>
                            <FormControl>
                                <ImageUpload 
                                    value={field.value ? [field.value] : []}
                                    disabled={isLoading}
                                    onChange={(url) => field.onChange(url)}
                                    onRemove={() => field.onChange('')}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className='grid grid-cols-3 gap-8'>
                    <FormField
                        control={form.control}
                        name='label'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Label
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        disabled={isLoading}
                                        placeholder='Billboard label'
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
                    {action}
                </Button>
            </form>
        </Form>
        <Separator />
    </>
  )
}

export default BillboardForm