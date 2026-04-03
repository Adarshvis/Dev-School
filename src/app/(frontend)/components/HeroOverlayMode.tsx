'use client'

/**
 * Marker component rendered inside the fullscreen-overlay hero.
 * CSS in hero-layouts.css uses `body:has(.hero-fullscreen-overlay)` to
 * detect this hero variant and apply transparent-header styling — no
 * JavaScript class manipulation needed, so zero hydration mismatch risk.
 */
export default function HeroOverlayMode() {
  return null
}
