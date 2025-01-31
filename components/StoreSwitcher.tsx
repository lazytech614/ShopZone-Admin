"use client"

import React, {useState} from 'react'
import { Store } from '@prisma/client'
import { useParams, useRouter } from 'next/navigation'
import { 
    Check, 
    ChevronsUpDown, 
    PlusCircle, 
    Store as StoreIcon 
} from 'lucide-react'

import { 
    Popover, 
    PopoverContent, 
    PopoverTrigger 
} from '@/components/ui/popover'
import { useStoreModal } from '@/hooks/useStoreModal'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { 
    Command, 
    CommandEmpty, 
    CommandGroup, 
    CommandInput, 
    CommandItem, 
    CommandList, 
    CommandSeparator
} from '@/components/ui/command'

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggerProps {
    items: Store[]
}

const StoreSwitcher: React.FC<StoreSwitcherProps> = ({ items=[],className }) => {
    const [isOpen, setIsOpen] = useState(false)

    const storeModal = useStoreModal()
    const params = useParams()
    const router = useRouter()

    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id
    }))

    const currentStore = formattedItems.find((item) => item.value === params.storeId)

    const onStoreSelect = (store: {value: string, label: string}) => {
        setIsOpen(false)
        router.push(`/${store.value}`)
    }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
            <Button
                variant={"outline"}
                size="sm"
                role="combobox"
                aria-expanded={isOpen}
                aria-label="Select a store"
                className={cn("w-[200px] justify-between", className)}
            >
                <StoreIcon className="mr-2 w-4 h-4" />
                {currentStore?.label}
                <ChevronsUpDown className="ml-2 w-4 h-4 shrink-0 opacity-50" />
            </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[200px] p-0' align='start'>
            <Command>
                <CommandList>
                    <CommandInput placeholder="Search store..." />
                    <CommandEmpty>
                        No store found.
                    </CommandEmpty>
                    <CommandGroup heading="Stores">
                        {formattedItems.map((store) => (
                            <CommandItem
                                key={store.value}
                                onSelect={() => onStoreSelect(store)}
                                className="text-sm"
                            >
                                <StoreIcon className="mr-2 w-4 h-4" />
                                {store.label}
                                <Check className={cn("ml-auto w-4 h-4", currentStore?.value === store.value ? "opacity-100" : "opacity-0", className)} />
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
                <CommandSeparator />
                <CommandList>
                    <CommandGroup>
                        <CommandItem 
                            onSelect={() => {
                                setIsOpen(false)
                                storeModal.onOpen()
                            }}
                            className="text-sm"
                        >
                            <PlusCircle className="mr-2 w-4 h-4" />
                            Create Store
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
  )
}

export default StoreSwitcher