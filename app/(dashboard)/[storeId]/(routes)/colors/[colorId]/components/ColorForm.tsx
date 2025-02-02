"use client"

import React, {useState} from 'react'
import { Color } from '@prisma/client'
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

const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(4).regex(/^#/, {
        message: "String must be a valid hex code."
    }),
})

type ColorFormValues = z.infer<typeof formSchema>

interface ColorFormProps {
    initialData: Color | null
}
const ColorForm: React.FC<ColorFormProps> = ({initialData}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const params = useParams()
    const router = useRouter()

    const title = initialData ? "Edit color" : "Create color"
    const description = initialData ? "Edit color" : "Add a new color"
    const toastMessage = initialData ? "Color updated successfully." : "Color created successfully."
    const action = initialData ? "Save changes" : "Create"

    const form = useForm<ColorFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            value: "",
        }
    })

    const onSubmit = async (data: ColorFormValues) => {
        try {
            setIsLoading(true)
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data)
            }else {
                await axios.post(`/api/${params.storeId}/colors`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/colors`)
            toast.success(toastMessage)
        }catch(err) {
            console.log(err)
            toast.error("Something went wrong.")
        }finally{
            setIsLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setIsLoading(true)
            await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`)
            router.refresh()
            router.push(`/${params.storeId}/colors`)
            toast.success("Color deleted successfully.")
        }catch(err) {
            console.log(err);
            toast.error("Make sure you removed all products and categories using this color.")
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
                                        placeholder='Color name'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='value'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Value
                                </FormLabel>
                                <FormControl>
                                    <div className='flex items-center gap-x-4'>
                                        <Input 
                                            disabled={isLoading}
                                            placeholder='Color value'
                                            {...field}
                                        />
                                        <div className='border p-4 rounded-full' style={{
                                            backgroundColor: field.value
                                        }}/>
                                    </div>
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
    </>
  )
}

export default ColorForm