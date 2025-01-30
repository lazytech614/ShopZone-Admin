import { UserButton } from '@clerk/nextjs'
import React from 'react'

const SetupPage = () => {
  return (
    <div>
      This is a protected route
      <UserButton />
    </div>
  )
}

export default SetupPage