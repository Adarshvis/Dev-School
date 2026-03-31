import type { CollectionConfig } from 'payload'
import type { Access } from 'payload'

// Type for user with role field
type UserWithRole = {
  id: string
  role?: 'superadmin' | 'admin' | 'editor' | 'author'
  [key: string]: unknown
}

// Access control helpers
// Note: Users without a role are treated as admins for backward compatibility
const isAdmin: Access = ({ req }) => {
  if (!req) return false
  const u = req.user as UserWithRole | null
  // If no role is set, treat as admin (backward compatibility)
  return !u?.role || u?.role === 'admin' || u?.role === 'superadmin'
}

const isSuperAdmin: Access = ({ req }) => {
  if (!req) return false
  const u = req.user as UserWithRole | null
  return u?.role === 'superadmin'
}

const isAdminOrEditor: Access = ({ req }) => {
  if (!req) return false
  const u = req.user as UserWithRole | null
  // If no role is set, treat as admin (backward compatibility)
  return !u?.role || u?.role === 'admin' || u?.role === 'editor'
}

const isAdminOrSelf: Access = ({ req }) => {
  if (!req) return false
  const u = req.user as UserWithRole | null
  // If no role is set, treat as admin (backward compatibility)
  if (!u?.role || u?.role === 'admin') return true
  return {
    id: {
      equals: u?.id,
    },
  }
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'createdAt'],
    group: 'Admin',
    hidden: ({ user }) => {
      const u = user as UserWithRole | null
      if (!u) return true
      // Hide from authors and editors
      if (u.role === 'author' || u.role === 'editor') return true
      return false
    },
  },
  auth: true,
  access: {
    // Only admins can create users (invitations handle author creation)
    create: ({ req }) => {
      if (!req) return false
      const u = req.user as UserWithRole | null
      if (!u) return false
      return !u.role || ['superadmin', 'admin'].includes(u.role)
    },
    // Users can read their own data, admins can read all
    read: ({ req }) => {
      if (!req) return false
      const u = req.user as UserWithRole | null
      if (!u) return false
      // Admins can read all users
      if (!u.role || ['superadmin', 'admin'].includes(u.role)) return true
      // Others can only read their own profile
      return { id: { equals: u.id } }
    },
    // Users can update their own data, admins can update all
    update: ({ req }) => {
      if (!req) return false
      const u = req.user as UserWithRole | null
      if (!u) return false
      // Admins can update all users
      if (!u.role || ['superadmin', 'admin'].includes(u.role)) return true
      // Others can only update their own profile
      return { id: { equals: u.id } }
    },
    // Only superadmins and admins can delete users
    delete: ({ req }) => {
      if (!req) return false
      const u = req.user as UserWithRole | null
      if (!u) return false
      return !u.role || ['superadmin', 'admin'].includes(u.role)
    },
    // All authenticated users can access admin panel (but will see limited collections)
    admin: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      admin: {
        description: 'Full name of the user',
      },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'author',
      options: [
        {
          label: 'Super Admin (Full Access + User Management)',
          value: 'superadmin',
        },
        {
          label: 'Admin (Full Access)',
          value: 'admin',
        },
        {
          label: 'Editor (Can edit all content)',
          value: 'editor',
        },
        {
          label: 'Author (Can only edit own content)',
          value: 'author',
        },
      ],
      admin: {
        description: 'User role determines access permissions',
        position: 'sidebar',
      },
      access: {
        // Only admins can change roles.
        update: ({ req, id }) => {
          if (!req) return false
          const u = req.user as UserWithRole | null
          if (!u) return false
          return !u.role || u.role === 'admin' || u.role === 'superadmin'
        },
      },
    },
    {
      name: 'allowedCollections',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Blog Posts', value: 'blog-posts' },
        { label: 'Publications', value: 'publications' },
        { label: 'News', value: 'news' },
        { label: 'Research Domains', value: 'research-domains' },
        { label: 'Instructors/People', value: 'instructors' },
        { label: 'Courses Page', value: 'courses-page' },
        { label: 'About Page', value: 'about-page' },
        { label: 'Home Page', value: 'home-page' },
        { label: 'Contact Page', value: 'contact-page' },
      ],
      admin: {
        description: 'Collections this user can edit (for Authors only)',
        position: 'sidebar',
        condition: (data) => data?.role === 'author',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Profile picture',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      admin: {
        description: 'Short biography',
      },
    },
    {
      name: 'department',
      type: 'text',
      admin: {
        description: 'Department or team',
      },
    },
    {
      name: 'lastLogin',
      type: 'date',
      admin: {
        readOnly: true,
        description: 'Last login timestamp',
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    afterLogin: [
      async ({ user, req }) => {
        // Update last login timestamp
        try {
          await req.payload.update({
            collection: 'users',
            id: user.id,
            data: {
              lastLogin: new Date().toISOString(),
            } as Record<string, unknown>,
          })
        } catch (error) {
          console.error('Error updating last login:', error)
        }
        return user
      },
    ],
  },
}
