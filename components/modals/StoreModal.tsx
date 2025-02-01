"use client"

import { useState } from "react"
import axios from "axios"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"

import { useStoreModal } from "@/hooks/useStoreModal"
import { Modal } from "@/components/ui/modal"
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
    name: z.string().min(1),
})

export const StoreModal = () => {
    const [isLoading, setIsLoading] = useState(false)

    const storeModal = useStoreModal()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true)
            const response = await axios.post("/api/stores", values)
            window.location.assign(`/${response.data.id}`)
        }catch(err) {
            toast.error("Something went wrong.")
        }finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal 
        isOpen={storeModal.isOpen} 
        onClose={storeModal.onClose}
        title="Create Store" description="Add a new store to manage products and categories.">
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input 
                                                disabled={isLoading}
                                                placeholder="E-Commerce" {...field} 
                                            />
                                        </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} 
                        />
                        <div className="pt-2 space-x-2 flex justify-end">
                            <Button 
                                disabled={isLoading}
                                variant={"outline"}
                                onClick={storeModal.onClose}
                            >
                                Cancel
                            </Button>
                            <Button 
                                disabled={isLoading}
                                variant={"default"}
                                type="submit"
                            >
                                Continue
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </Modal>
    )
}