import type { Access } from 'payload'

// Type for user with role and allowedCollections fields
export type UserWithRole = {
  id: string
  role?: 'superadmin' | 'admin' | 'editor' | 'author'
  allowedCollections?: string[]
  [key: string]: unknown
}

// Safe user extraction that handles undefined req
export function getSafeUser(req: any): UserWithRole | null {
  if (!req || !req.user) return null
  return req.user as UserWithRole | null
}

// Check if user has admin/editor access
export function hasAdminAccess(req: any): boolean {
  const user = getSafeUser(req)
  if (!user) return false
  return !user.role || ['superadmin', 'admin', 'editor'].includes(user.role)
}

// Check if user is superadmin or admin only
export function hasAdminOnlyAccess(req: any): boolean {
  const user = getSafeUser(req)
  if (!user) return false
  return !user.role || ['superadmin', 'admin'].includes(user.role)
}

// Check if user has access to a specific collection
export function hasCollectionAccess(req: any, collectionSlug: string): boolean {
  const user = getSafeUser(req)
  if (!user) return false
  
  // Admins have access to everything
  if (!user.role || ['superadmin', 'admin', 'editor'].includes(user.role)) return true
  
  // Authors are restricted by allowedCollections
  if (user.role === 'author') {
    const allowed = user.allowedCollections || []
    return allowed.includes(collectionSlug)
  }
  
  return false
}

// Check if user can access a collection (for use in access controls)
export function canAccessCollection(collectionSlug: string): Access {
  return ({ req }) => hasCollectionAccess(req, collectionSlug)
}

/**
 * Check if user is a super admin
 */
export const isSuperAdmin: Access = ({ req }) => {
  if (!req) return false
  const u = req.user as UserWithRole | null
  return u?.role === 'superadmin'
}

/**
 * Check if user is an admin (includes superadmin)
 * Users without a role are treated as admins for backward compatibility
 */
export const isAdmin: Access = ({ req }) => {
  if (!req) return false
  const u = req.user as UserWithRole | null
  if (!u) return false
  // If no role is set, treat as admin (backward compatibility)
  return !u.role || u.role === 'admin' || u.role === 'superadmin'
}

/**
 * Check if user is an admin or editor
 */
export const isAdminOrEditor: Access = ({ req }) => {
  if (!req) return false
  const u = req.user as UserWithRole | null
  if (!u) return false
  // If no role is set, treat as admin (backward compatibility)
  return !u.role || u.role === 'admin' || u.role === 'superadmin' || u.role === 'editor'
}

/**
 * Access control for reading content
 * All authenticated users can read, or allow public read
 */
export const canRead = (publicAccess: boolean = true): Access => {
  return ({ req }) => {
    if (publicAccess) return true
    if (!req) return false
    return !!req.user
  }
}

/**
 * Standard access control for content collections
 * - Read: Public (everyone can read)
 * - Create/Update/Delete: Admin, Editor, or Author with permission
 */
export const contentCollectionAccess = (collectionSlug: string) => ({
  read: () => true,
  create: canAccessCollection(collectionSlug),
  update: canAccessCollection(collectionSlug),
  delete: canAccessCollection(collectionSlug),
})

/**
 * Access control for admin-only collections (like Users, Settings)
 */
export const adminOnlyAccess = {
  read: isAdmin,
  create: isAdmin,
  update: isAdmin,
  delete: isSuperAdmin, // Only superadmin can delete
}
