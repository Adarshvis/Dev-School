'use client'

import React, { useState, useEffect } from 'react'
import type { LucideProps } from 'lucide-react'

interface LucideIconProps extends Omit<LucideProps, 'ref'> {
  name: string
}

export default function LucideIcon({ name, ...props }: LucideIconProps) {
  const [Icon, setIcon] = useState<React.FC<LucideProps> | null>(null)

  useEffect(() => {
    let cancelled = false
    import('lucide-react').then((mod) => {
      if (cancelled) return
      const Comp = (mod as any)[name] as React.FC<LucideProps> | undefined
      if (Comp) setIcon(() => Comp)
    })
    return () => { cancelled = true }
  }, [name])

  if (!Icon) return null
  return <Icon {...props} />
}
