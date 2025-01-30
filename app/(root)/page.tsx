"use client"

import { useStoreModal } from '@/hooks/useStoreModal'
import { UserButton } from '@clerk/nextjs'
import React, { useEffect } from 'react'

const SetupPage = () => {
  const onOpen = useStoreModal((state) => state.onOpen)
  const isOpen = useStoreModal((state) => state.isOpen)

  useEffect(() => {
    if(!isOpen) onOpen()
  }, [isOpen, onOpen])

  return (
    <div>
      {/* This is a protected route
      <UserButton /> */}
      Root page
    </div>
  )
}

export default SetupPage