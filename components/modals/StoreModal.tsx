"use client"

import { useStoreModal } from "@/hooks/useStoreModal"
import { Modal } from "@/components/ui/modal"

export const StoreModal = () => {
    const storeModal = useStoreModal()
    return (
        <Modal 
        isOpen={storeModal.isOpen} 
        onClose={storeModal.onClose}
        title="Create Store" description="Add a new store to manage products and categories.">
            <div>Future create store form</div>
        </Modal>
    )
}