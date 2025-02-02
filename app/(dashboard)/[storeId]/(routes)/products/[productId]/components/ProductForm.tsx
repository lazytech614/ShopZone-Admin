"use client"

import React, {useState} from 'react'
import * as z from 'zod'
import { Trash } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { 
    Category, 
    Image, 
    Product, 
    Size, 
    Color 
} from '@prisma/client'
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
    FormDescription, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AlertModal } from '@/components/modals/AlertModal'
import { ImageUpload } from '@/components/ui/imageUpload'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from '@/components/ui/checkbox'

const formSchema = z.object({
    name: z.string().min(1),
    images: z.object({url: z.string()}).array(),
    price: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    sizeId: z.string().min(1),
    colorId: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
})

type ProductFormValues = z.infer<typeof formSchema>

interface ProductFormProps {
    initialData: Product & {
        images: Image[]
    } | null
    categories: Category[]
    sizes: Size[]
    colors: Color[]
}
const ProductForm: React.FC<ProductFormProps> = ({
    initialData,
    categories,
    sizes,
    colors
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const params = useParams()
    const router = useRouter()

    const title = initialData ? "Edit product" : "Create product"
    const description = initialData ? "Edit product" : "Add a new product"
    const toastMessage = initialData ? "Product updated successfully." : "Product created successfully."
    const action = initialData ? "Save changes" : "Create"

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        // @ts-expect-error Did it to remove the error
        defaultValues: initialData ? {
            ...initialData,
            price: parseFloat(String(initialData?.price)),
        } : {
            name: "",
            images: [],
            price: 0,
            categoryId: "",
            sizeId: "",
            colorId: "",
            isFeatured: false,
            isArchived: false
        }
    })

    const onSubmit = async (data: ProductFormValues) => {
        try {
            setIsLoading(true)
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data)
            }else {
                console.log("StoreId", params.storeId);
                await axios.post(`/api/${params.storeId}/products`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/products`)
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
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
            router.refresh()
            router.push(`/${params.storeId}/products`)
            toast.success("Color deleted successfully.")
        }catch(err) {
            console.log(err)
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
                <FormField
                    control={form.control}
                    name='images'
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Product images
                            </FormLabel>
                            <FormControl>
                                <ImageUpload 
                                    value={field.value.map((image) => image.url)}
                                    disabled={isLoading}
                                    onChange={(url) => field.onChange([...field.value, {url}])}
                                    onRemove={(url) => field.onChange(field.value.filter((current) => current.url !== url))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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
                                        placeholder='Product name'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />  
                    <FormField
                        control={form.control}
                        name='price'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Price
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        disabled={isLoading}
                                        placeholder='9.89'
                                        type='number'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />  
                <FormField
                    control={form.control}
                    name='categoryId'
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Category
                            </FormLabel>
                            <Select
                                disabled={isLoading}
                                onValueChange={field.onChange}
                                value={field.value}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue
                                            defaultValue={field.value}
                                            placeholder="Select a category"
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={category.id}
                                        >{category.name}</SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='sizeId'
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Size
                            </FormLabel>
                            <Select
                                disabled={isLoading}
                                onValueChange={field.onChange}
                                value={field.value}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue
                                            defaultValue={field.value}
                                            placeholder="Select a size"
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {sizes.map((size) => (
                                        <SelectItem
                                            key={size.id}
                                            value={size.id}
                                        >{size.name}</SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='colorId'
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Color
                            </FormLabel>
                            <Select
                                disabled={isLoading}
                                onValueChange={field.onChange}
                                value={field.value}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue
                                            defaultValue={field.value}
                                            placeholder="Select a color"
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {colors.map((color) => (
                                        <SelectItem
                                            key={color.id}
                                            value={color.id}
                                        >{color.name}</SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='isFeatured'
                    render={({field}) => (
                        <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                            <FormControl>
                                <Checkbox 
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className='space-y-1 leading-none'>
                                <FormLabel>
                                    Featured
                                </FormLabel>
                                <FormDescription>
                                    This product will appear on the home page.
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                /> 
                <FormField
                    control={form.control}
                    name='isArchived'
                    render={({field}) => (
                        <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                            <FormControl>
                                <Checkbox 
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className='space-y-1 leading-none'>
                                <FormLabel>
                                    Archived
                                </FormLabel>
                                <FormDescription>
                                    This product will not appear anywhere in the store.
                                </FormDescription>
                            </div>
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

export default ProductForm