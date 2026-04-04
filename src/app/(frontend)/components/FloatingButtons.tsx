'use client'

import { useState } from 'react'

interface FloatingButton {
  enabled?: boolean
  label?: string
  icon?: string
  customIconClass?: string
  linkType?: 'url' | 'phone' | 'email' | 'whatsapp'
  url?: string
  phone?: string
  email?: string
  whatsappMessage?: string
  openInNewTab?: boolean
  backgroundColor?: string
  iconColor?: string
  position?: 'bottom-right' | 'bottom-left'
  tooltip?: string
}

function getHref(btn: FloatingButton): string {
  const type = btn.linkType || 'url'
  if (type === 'phone') {
    const num = String(btn.phone || '').replace(/\s+/g, '')
    return num ? `tel:${num}` : '#'
  }
  if (type === 'email') {
    const addr = String(btn.email || '').trim()
    return addr ? `mailto:${addr}` : '#'
  }
  if (type === 'whatsapp') {
    const num = String(btn.phone || '').replace(/[^+\d]/g, '')
    const msg = btn.whatsappMessage ? `?text=${encodeURIComponent(btn.whatsappMessage)}` : ''
    return num ? `https://wa.me/${num.replace(/^\+/, '')}${msg}` : '#'
  }
  // url
  const raw = String(btn.url || '').trim()
  if (!raw) return '#'
  if (/^https?:\/\//i.test(raw) || /^mailto:|^tel:/i.test(raw)) return raw
  return `https://${raw}`
}

export default function FloatingButtons({ buttons }: { buttons?: FloatingButton[] }) {
  const active = (buttons || []).filter((b) => b.enabled !== false)
  if (active.length === 0) return null

  // Group by position
  const rightButtons = active.filter((b) => b.position !== 'bottom-left')
  const leftButtons = active.filter((b) => b.position === 'bottom-left')

  return (
    <>
      {rightButtons.length > 0 && (
        <div className="floating-buttons floating-buttons-right">
          {rightButtons.map((btn, i) => (
            <ButtonItem key={i} btn={btn} />
          ))}
        </div>
      )}
      {leftButtons.length > 0 && (
        <div className="floating-buttons floating-buttons-left">
          {leftButtons.map((btn, i) => (
            <ButtonItem key={i} btn={btn} />
          ))}
        </div>
      )}
    </>
  )
}

function ButtonItem({ btn }: { btn: FloatingButton }) {
  const [hovered, setHovered] = useState(false)
  const iconClass = (btn.customIconClass || '').trim() || btn.icon || 'bi-whatsapp'
  const href = getHref(btn)
  const bg = btn.backgroundColor || '#25D366'
  const color = btn.iconColor || '#ffffff'

  return (
    <a
      href={href}
      className="floating-btn"
      aria-label={btn.label || 'Floating button'}
      target={btn.openInNewTab !== false ? '_blank' : undefined}
      rel={btn.openInNewTab !== false ? 'noopener noreferrer' : undefined}
      style={{ backgroundColor: bg, color }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <i className={`bi ${iconClass}`} />
      {btn.tooltip && hovered && (
        <span className="floating-btn-tooltip">{btn.tooltip}</span>
      )}
    </a>
  )
}
