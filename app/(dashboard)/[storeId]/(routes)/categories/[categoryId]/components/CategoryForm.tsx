"use client"

import React, {useState} from 'react'
import { Category } from '@prisma/client'
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
    name: z.string().min(1),
    categoryImage: z.string().min(1),
})

type CategoryFormValues = z.infer<typeof formSchema>

interface CategoryFormProps {
    initialData: Category | null
}
const CategoryForm: React.FC<CategoryFormProps> = ({initialData}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const params = useParams()
    const router = useRouter()

    const title = initialData ? "Edit category" : "Create category"
    const description = initialData ? "Edit category" : "Add a new category"
    const toastMessage = initialData ? "Category updated successfully." : "Category created successfully."
    const action = initialData ? "Save changes" : "Create"

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            categoryImage: "",
        }
    })

    const onSubmit = async (data: CategoryFormValues) => {
        try {
            setIsLoading(true)
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data)
            }else {
                await axios.post(`/api/${params.storeId}/categories`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/categories`)
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
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
            router.refresh()
            router.push(`/${params.storeId}/categories`)
            toast.success("Category deleted successfully.")
        }catch(err) {
            console.log(err);
            toast.error("Make sure you removed all products from this category.")
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
                        name='categoryImage'
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
                                        placeholder='Category name'
                                        className='text-sm'
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
    </>
  )
}

export default CategoryForm