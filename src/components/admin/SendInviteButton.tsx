'use client'

import React from 'react'
import { useFormFields, useDocumentInfo } from '@payloadcms/ui'
import { SaveButton } from '@payloadcms/ui'

const SendInviteButton: React.FC = () => {
  const { id } = useDocumentInfo()
  
  // If editing existing invitation, show "Save" 
  // If creating new invitation, show "Send Invite"
  const label = id ? 'Save' : 'Send Invite'

  return <SaveButton label={label} />
}

export default SendInviteButton
