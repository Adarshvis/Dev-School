import type { CollectionConfig } from 'payload'

// Type for user with role field
type UserWithRole = {
  id: string
  role?: 'superadmin' | 'admin' | 'editor' | 'author'
  [key: string]: unknown
}

export const Publications: CollectionConfig = {
  slug: 'publications',
  labels: {
    singular: 'Publication',
    plural: 'Publications',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publisher', 'year', 'type', 'createdBy', 'updatedAt'],
    group: 'Content Management',
    description: 'Manage lab publications - journal articles, conference papers, book chapters, etc.',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => {
      // All authenticated users can create
      return !!user
    },
    update: ({ req: { user } }) => {
      const u = user as UserWithRole | null
      if (!u) return false
      // Admins and editors can update all
      if (['superadmin', 'admin', 'editor'].includes(u.role || '')) return true
      // Authors can only update their own
      return {
        createdBy: { equals: u.id },
      }
    },
    delete: ({ req: { user } }) => {
      const u = user as UserWithRole | null
      if (!u) return false
      // Only admins can delete all
      if (['superadmin', 'admin'].includes(u.role || '')) return true
      // Authors can only delete their own
      return {
        createdBy: { equals: u.id },
      }
    },
  },
  hooks: {
    beforeChange: [
      // Auto-set createdBy on create
      async ({ data, req, operation }) => {
        if (operation === 'create' && req.user) {
          data.createdBy = req.user.id
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Publication Title',
    },
    {
      name: 'publisher',
      type: 'text',
      required: true,
      label: 'Publisher / Journal / Conference',
      admin: {
        description: 'e.g., ACM Transactions on Asian and Low-Resource Language Processing',
      },
    },
    {
      name: 'authors',
      type: 'array',
      required: true,
      label: 'Authors',
      minRows: 1,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'isLabMember',
          type: 'checkbox',
          defaultValue: false,
          label: 'Is Lab Member?',
          admin: {
            description: 'Check if this author is a lab member (will appear in Author filter)',
          },
        },
      ],
    },
    {
      name: 'keywords',
      type: 'array',
      label: 'Keywords / Research Areas',
      fields: [
        {
          name: 'keyword',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'year',
      type: 'number',
      required: true,
      label: 'Publication Year',
      min: 1990,
      max: 2100,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Publication Type',
      defaultValue: 'journal',
      options: [
        { label: 'Journal Article', value: 'journal' },
        { label: 'Conference Paper', value: 'conference' },
        { label: 'Book Chapter', value: 'book-chapter' },
        { label: 'Technical Report', value: 'technical-report' },
        { label: 'Thesis', value: 'thesis' },
      ],
    },
    {
      name: 'abstract',
      type: 'textarea',
      label: 'Abstract',
      admin: {
        description: 'Optional abstract or summary of the publication',
      },
    },
    {
      name: 'doi',
      type: 'text',
      label: 'DOI',
      admin: {
        description: 'Digital Object Identifier (e.g., 10.1145/3597926)',
      },
    },
    {
      name: 'link',
      type: 'text',
      label: 'External Link',
      admin: {
        description: 'Link to publication (PDF, publisher page, etc.)',
      },
    },
    {
      name: 'pdfFile',
      type: 'upload',
      relationTo: 'media',
      label: 'PDF File',
      admin: {
        description: 'Upload the publication PDF (optional)',
      },
    },
    {
      name: 'citationCount',
      type: 'number',
      label: 'Citation Count',
      defaultValue: 0,
      admin: {
        description: 'Number of citations (for sorting by relevance)',
      },
    },
    {
      name: 'importSource',
      type: 'select',
      label: 'Import Source',
      admin: {
        description: 'How was this publication added?',
        position: 'sidebar',
      },
      options: [
        { label: 'Manual Entry', value: 'manual' },
        { label: 'Google Scholar', value: 'google-scholar' },
        { label: 'ORCID', value: 'orcid' },
        { label: 'Scopus', value: 'scopus' },
        { label: 'CrossRef', value: 'crossref' },
        { label: 'Semantic Scholar', value: 'semantic-scholar' },
      ],
      defaultValue: 'manual',
    },
    {
      name: 'externalId',
      type: 'text',
      label: 'External ID',
      admin: {
        description: 'ID from external source (for avoiding duplicates during import)',
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'published',
      admin: {
        position: 'sidebar',
      },
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
        { label: 'Archived', value: 'archived' },
      ],
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'User who created this publication',
      },
    },
  ],
}
