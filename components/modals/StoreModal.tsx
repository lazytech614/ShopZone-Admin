"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

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
    const storeModal = useStoreModal()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values)
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
                                        <Input placeholder="E-Commerce" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} 
                        />
                        <div className="pt-2 space-x-2 flex justify-end">
                            <Button 
                                variant={"outline"}
                                onClick={storeModal.onClose}
                            >
                                Cancel
                            </Button>
                            <Button 
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