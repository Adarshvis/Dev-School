'use client'

import { useAuth } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'

export const LogoutButton = (props: Record<string, any>) => {
  const { logOut } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logOut()
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        background: '#011e2c',
        color: '#fff',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'opacity 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
    >
      Logout
    </button>
  )
}
