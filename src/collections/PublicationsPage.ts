import type { CollectionConfig } from 'payload'

export const PublicationsPage: CollectionConfig = {
  slug: 'publications-page',
  labels: {
    singular: 'Publications Page',
    plural: 'Publications Page',
  },
  admin: {
    useAsTitle: 'sectionName',
    defaultColumns: ['sectionName', 'sectionType', 'status', 'updatedAt'],
    group: 'Content Management',
    description: 'Manage publications page sections and configuration.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'order',
      type: 'number',
      required: false,
      defaultValue: 0,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'sectionName',
      type: 'text',
      required: true,
    },
    {
      name: 'sectionType',
      type: 'select',
      required: true,
      options: [
        { label: 'Page Title', value: 'page-title' },
        { label: 'Filters Configuration', value: 'filters' },
        { label: 'Publications List', value: 'publications-list' },
        { label: 'API Import Settings', value: 'api-settings' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
    },

    // PAGE TITLE
    {
      name: 'pageTitle',
      type: 'group',
      admin: {
        condition: (data) => data.sectionType === 'page-title',
      },
      fields: [
        { name: 'title', type: 'text', required: true, defaultValue: 'Publications' },
        { name: 'subtitle', type: 'text' },
        {
          name: 'breadcrumbs',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'link', type: 'text' },
            { name: 'isActive', type: 'checkbox', defaultValue: false },
          ],
        },
      ],
    },

    // FILTERS CONFIGURATION
    {
      name: 'filters',
      type: 'group',
      admin: {
        condition: (data) => data.sectionType === 'filters',
      },
      fields: [
        {
          name: 'showTimeFilter',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Time Filter',
        },
        {
          name: 'timeFilterOptions',
          type: 'array',
          label: 'Time Filter Options',
          admin: {
            condition: (data, siblingData) => siblingData?.showTimeFilter,
          },
          fields: [
            { name: 'label', type: 'text', required: true },
            { 
              name: 'value', 
              type: 'text', 
              required: true,
              admin: {
                description: 'Use "any" for any time, year number like "2025", or "custom" for custom range',
              },
            },
          ],
          defaultValue: [
            { label: 'Any time', value: 'any' },
            { label: 'Since 2026', value: '2026' },
            { label: 'Since 2025', value: '2025' },
            { label: 'Since 2024', value: '2024' },
            { label: 'Since 2022', value: '2022' },
            { label: 'Custom range...', value: 'custom' },
          ],
        },
        {
          name: 'showTypeFilter',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Publication Type Filter',
        },
        {
          name: 'typeFilterOptions',
          type: 'array',
          label: 'Publication Type Options',
          admin: {
            condition: (data, siblingData) => siblingData?.showTypeFilter,
          },
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'value', type: 'text', required: true },
          ],
          defaultValue: [
            { label: 'Journal Article', value: 'journal' },
            { label: 'Conference Paper', value: 'conference' },
            { label: 'Book Chapter', value: 'book-chapter' },
            { label: 'Technical Report', value: 'technical-report' },
            { label: 'Thesis', value: 'thesis' },
          ],
        },
        {
          name: 'showAuthorFilter',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Author Filter',
        },
        {
          name: 'authorFilterOptions',
          type: 'array',
          label: 'Author Filter Options (Lab Members)',
          admin: {
            condition: (data, siblingData) => siblingData?.showAuthorFilter,
            description: 'Add lab members who should appear in the author filter',
          },
          fields: [
            { name: 'name', type: 'text', required: true },
          ],
        },
        {
          name: 'showKeywordFilter',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Keywords/Research Area Filter',
        },
        {
          name: 'keywordFilterOptions',
          type: 'array',
          label: 'Keyword Filter Options',
          admin: {
            condition: (data, siblingData) => siblingData?.showKeywordFilter,
          },
          fields: [
            { name: 'keyword', type: 'text', required: true },
          ],
        },
        {
          name: 'sortOptions',
          type: 'array',
          label: 'Sort Options',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'value', type: 'text', required: true },
          ],
          defaultValue: [
            { label: 'Sort by relevance', value: 'relevance' },
            { label: 'Sort by date', value: 'date' },
          ],
        },
      ],
    },

    // PUBLICATIONS LIST CONFIGURATION
    {
      name: 'publicationsList',
      type: 'group',
      admin: {
        condition: (data) => data.sectionType === 'publications-list',
      },
      fields: [
        {
          name: 'searchPlaceholder',
          type: 'text',
          defaultValue: 'Search publications...',
        },
        {
          name: 'itemsPerPage',
          type: 'number',
          defaultValue: 20,
          label: 'Items Per Page',
        },
        {
          name: 'tableColumns',
          type: 'group',
          label: 'Visible Table Columns',
          fields: [
            { name: 'showPublication', type: 'checkbox', defaultValue: true, label: 'Publication Title' },
            { name: 'showPublisher', type: 'checkbox', defaultValue: true, label: 'Publisher' },
            { name: 'showAuthors', type: 'checkbox', defaultValue: true, label: 'Author(s)' },
            { name: 'showKeywords', type: 'checkbox', defaultValue: true, label: 'Keyword(s)' },
            { name: 'showYear', type: 'checkbox', defaultValue: true, label: 'Year' },
            { name: 'showType', type: 'checkbox', defaultValue: false, label: 'Type' },
            { name: 'showCitations', type: 'checkbox', defaultValue: false, label: 'Citations' },
          ],
        },
        {
          name: 'emptyMessage',
          type: 'text',
          defaultValue: 'No publications found matching your criteria.',
        },
      ],
    },

    // API IMPORT SETTINGS
    {
      name: 'apiSettings',
      type: 'group',
      admin: {
        condition: (data) => data.sectionType === 'api-settings',
      },
      fields: [
        {
          name: 'enableGoogleScholar',
          type: 'checkbox',
          defaultValue: false,
          label: 'Enable Google Scholar Import',
        },
        {
          name: 'googleScholarAuthorId',
          type: 'text',
          label: 'Google Scholar Author ID',
          admin: {
            condition: (data, siblingData) => siblingData?.enableGoogleScholar,
            description: 'Author ID from Google Scholar profile URL',
          },
        },
        {
          name: 'serpApiKey',
          type: 'text',
          label: 'SerpAPI Key',
          admin: {
            condition: (data, siblingData) => siblingData?.enableGoogleScholar,
            description: 'API key for SerpAPI (Google Scholar scraping)',
          },
        },
        {
          name: 'enableOrcid',
          type: 'checkbox',
          defaultValue: false,
          label: 'Enable ORCID Import',
        },
        {
          name: 'orcidId',
          type: 'text',
          label: 'ORCID ID',
          admin: {
            condition: (data, siblingData) => siblingData?.enableOrcid,
            description: 'e.g., 0000-0002-1234-5678',
          },
        },
        {
          name: 'enableScopus',
          type: 'checkbox',
          defaultValue: false,
          label: 'Enable Scopus Import',
        },
        {
          name: 'scopusApiKey',
          type: 'text',
          label: 'Scopus API Key',
          admin: {
            condition: (data, siblingData) => siblingData?.enableScopus,
          },
        },
        {
          name: 'scopusAuthorId',
          type: 'text',
          label: 'Scopus Author ID',
          admin: {
            condition: (data, siblingData) => siblingData?.enableScopus,
          },
        },
        {
          name: 'autoImportEnabled',
          type: 'checkbox',
          defaultValue: false,
          label: 'Enable Auto-Import',
          admin: {
            description: 'Automatically fetch new publications periodically',
          },
        },
        {
          name: 'importFrequency',
          type: 'select',
          label: 'Import Frequency',
          admin: {
            condition: (data, siblingData) => siblingData?.autoImportEnabled,
          },
          options: [
            { label: 'Daily', value: 'daily' },
            { label: 'Weekly', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' },
          ],
          defaultValue: 'weekly',
        },
      ],
    },
  ],
}
