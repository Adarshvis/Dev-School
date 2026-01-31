import type { Access } from 'payload'

// Type for user with role and allowedCollections fields
export type UserWithRole = {
  id: string
  role?: 'superadmin' | 'admin' | 'editor' | 'author'
  allowedCollections?: string[]
  [key: string]: unknown
}

/**
 * Check if user is a super admin
 */
export const isSuperAdmin: Access = ({ req: { user } }) => {
  const u = user as UserWithRole | null
  return u?.role === 'superadmin'
}

/**
 * Check if user is an admin (includes superadmin)
 * Users without a role are treated as admins for backward compatibility
 */
export const isAdmin: Access = ({ req: { user } }) => {
  const u = user as UserWithRole | null
  if (!u) return false
  // If no role is set, treat as admin (backward compatibility)
  return !u.role || u.role === 'admin' || u.role === 'superadmin'
}

/**
 * Check if user is an admin or editor
 */
export const isAdminOrEditor: Access = ({ req: { user } }) => {
  const u = user as UserWithRole | null
  if (!u) return false
  // If no role is set, treat as admin (backward compatibility)
  return !u.role || u.role === 'admin' || u.role === 'superadmin' || u.role === 'editor'
}

/**
 * Check if user has access to a specific collection
 * - Superadmin/Admin/Editor: Full access to all collections
 * - Author: Only access to collections in their allowedCollections list
 */
export const canAccessCollection = (collectionSlug: string): Access => {
  return ({ req: { user } }) => {
    const u = user as UserWithRole | null
    if (!u) return false
    
    // Superadmin, admin, or no role (backward compatibility) - full access
    if (!u.role || u.role === 'superadmin' || u.role === 'admin') {
      return true
    }
    
    // Editor - full access to content
    if (u.role === 'editor') {
      return true
    }
    
    // Author - check allowedCollections
    if (u.role === 'author') {
      return u.allowedCollections?.includes(collectionSlug) || false
    }
    
    return false
  }
}

/**
 * Access control for reading content
 * All authenticated users can read, or allow public read
 */
export const canRead = (publicAccess: boolean = true): Access => {
  return ({ req: { user } }) => {
    if (publicAccess) return true
    return !!user
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
