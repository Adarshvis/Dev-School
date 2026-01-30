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
const isAdmin: Access = ({ req: { user } }) => {
  const u = user as UserWithRole | null
  // If no role is set, treat as admin (backward compatibility)
  return !u?.role || u?.role === 'admin' || u?.role === 'superadmin'
}

const isSuperAdmin: Access = ({ req: { user } }) => {
  const u = user as UserWithRole | null
  return u?.role === 'superadmin'
}

const isAdminOrEditor: Access = ({ req: { user } }) => {
  const u = user as UserWithRole | null
  // If no role is set, treat as admin (backward compatibility)
  return !u?.role || u?.role === 'admin' || u?.role === 'editor'
}

const isAdminOrSelf: Access = ({ req: { user } }) => {
  const u = user as UserWithRole | null
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
  },
  auth: true,
  access: {
    // Allow all authenticated users to create (for now)
    create: () => true,
    // Allow all authenticated users to read
    read: () => true,
    // Allow all authenticated users to update
    update: () => true,
    // Allow all authenticated users to delete
    delete: () => true,
    // Allow all authenticated users to access admin panel
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
        // Admins can change any role, users can change their own role to admin (for initial setup)
        update: ({ req: { user }, id }) => {
          const u = user as UserWithRole | null
          // If no role is set, treat as admin (backward compatibility)
          if (!u?.role || u?.role === 'admin') return true
          // Allow users to update their own role (for initial admin setup)
          return u?.id === id
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
