import type { Block } from 'payload'
import { colorPickerField } from '@innovixx/payload-color-picker-field'

export const featureShowcaseBlock: Block = {
  slug: 'featureShowcase',
  labels: {
    singular: 'Feature Showcase',
    plural: 'Feature Showcases',
  },
  fields: [
    // ── Section-level settings ──
    colorPickerField({
      name: 'sectionBgColor',
      label: 'Section Background Color',
      admin: { description: 'Background of the outer container (default: light gradient)' },
    }),
    {
      name: 'sectionBorderRadius',
      type: 'number',
      label: 'Section Border Radius (px)',
      defaultValue: 40,
      min: 0,
      max: 80,
      admin: { description: 'Rounded corners on the outer container' },
    },

    // ── LEFT COLUMN — Visual Grid ──
    {
      type: 'collapsible',
      label: 'Left Column — Visual Grid',
      fields: [
        {
          name: 'gridColumns',
          type: 'select',
          label: 'Grid Columns',
          defaultValue: '2',
          options: [
            { label: '1 Column', value: '1' },
            { label: '2 Columns', value: '2' },
            { label: '3 Columns', value: '3' },
          ],
        },
        {
          name: 'gridItems',
          type: 'array',
          label: 'Grid Items',
          admin: { description: 'Add any number of visual cards to the left grid' },
          fields: [
            {
              name: 'itemType',
              type: 'select',
              label: 'Item Type',
              defaultValue: 'image',
              options: [
                { label: 'Image', value: 'image' },
                { label: 'Stat Card (Progress Ring)', value: 'progressRing' },
                { label: 'Pill Badges', value: 'pillBadges' },
                { label: 'Rich Content Card', value: 'richCard' },
              ],
            },
            // ── Shared card settings ──
            colorPickerField({
              name: 'bgColor',
              label: 'Card Background Color',
            }),
            colorPickerField({
              name: 'textColor',
              label: 'Card Text Color',
            }),
            {
              name: 'colSpan',
              type: 'select',
              label: 'Column Span',
              defaultValue: '1',
              options: [
                { label: '1 Column', value: '1' },
                { label: '2 Columns (full width)', value: '2' },
              ],
              admin: { description: 'How many grid columns this item spans' },
            },

            // ── Image type ──
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Image',
              admin: {
                condition: (_, s) => s?.itemType === 'image',
              },
            },
            {
              name: 'imagePosition',
              type: 'select',
              label: 'Image Position',
              defaultValue: 'cover',
              options: [
                { label: 'Cover (fill card)', value: 'cover' },
                { label: 'Center (contained)', value: 'contain' },
                { label: 'Bottom Aligned', value: 'bottom' },
              ],
              admin: {
                condition: (_, s) => s?.itemType === 'image',
              },
            },

            // ── Progress Ring type ──
            {
              name: 'progressValue',
              type: 'number',
              label: 'Progress Percentage',
              min: 0,
              max: 100,
              defaultValue: 78,
              admin: {
                condition: (_, s) => s?.itemType === 'progressRing',
                description: 'e.g. 78 for 78%',
              },
            },
            colorPickerField({
              name: 'progressColor',
              label: 'Progress Ring Color',
              admin: {
                condition: (_, s) => s?.itemType === 'progressRing',
              },
            }),
            {
              name: 'progressLabel',
              type: 'text',
              label: 'Label Below Ring',
              admin: {
                condition: (_, s) => s?.itemType === 'progressRing',
              },
            },

            // ── Pill Badges type ──
            {
              name: 'pills',
              type: 'array',
              label: 'Pill Badges',
              admin: {
                condition: (_, s) => s?.itemType === 'pillBadges',
                description: 'Add floating pill labels',
              },
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  label: 'Pill Text',
                },
                colorPickerField({
                  name: 'pillColor',
                  label: 'Pill Background Color',
                }),
                colorPickerField({
                  name: 'pillTextColor',
                  label: 'Pill Text Color',
                }),
              ],
            },

            // ── Rich Content Card type ──
            {
              name: 'richContent',
              type: 'richText',
              label: 'Card Content (Rich Text)',
              admin: {
                condition: (_, s) => s?.itemType === 'richCard',
              },
            },

            // ── Floating badge (works with any type) ──
            {
              type: 'collapsible',
              label: 'Floating Badge (optional)',
              admin: {
                description: 'Overlay a small floating badge on this card',
              },
              fields: [
                {
                  name: 'badgeEnabled',
                  type: 'checkbox',
                  label: 'Show Floating Badge',
                  defaultValue: false,
                },
                {
                  name: 'badgeIcon',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Badge Icon',
                  admin: { condition: (_, s) => s?.badgeEnabled },
                },
                {
                  name: 'badgeStat',
                  type: 'text',
                  label: 'Badge Stat (e.g. "99.8%")',
                  admin: { condition: (_, s) => s?.badgeEnabled },
                },
                {
                  name: 'badgeLabel',
                  type: 'text',
                  label: 'Badge Label (e.g. "User Satisfaction")',
                  admin: { condition: (_, s) => s?.badgeEnabled },
                },
                colorPickerField({
                  name: 'badgeBorderColor',
                  label: 'Badge Accent Color',
                  admin: { condition: (_, s) => s?.badgeEnabled },
                }),
                {
                  name: 'badgePosition',
                  type: 'select',
                  label: 'Badge Position',
                  defaultValue: 'top-right',
                  options: [
                    { label: 'Top Right', value: 'top-right' },
                    { label: 'Top Left', value: 'top-left' },
                    { label: 'Bottom Right', value: 'bottom-right' },
                    { label: 'Bottom Left', value: 'bottom-left' },
                  ],
                  admin: { condition: (_, s) => s?.badgeEnabled },
                },
              ],
            },
          ],
        },
      ],
    },

    // ── RIGHT COLUMN — Content Panel ──
    {
      type: 'collapsible',
      label: 'Right Column — Content Panel',
      fields: [
        colorPickerField({
          name: 'panelBgColor',
          label: 'Panel Background Color',
          admin: { description: 'Default: white' },
        }),
        {
          name: 'panelBorderRadius',
          type: 'number',
          label: 'Panel Border Radius (px)',
          defaultValue: 40,
          min: 0,
          max: 80,
        },
        // Badge pill
        {
          name: 'badgeText',
          type: 'text',
          label: 'Badge Text (e.g. "Why Choose Us?")',
        },
        colorPickerField({
          name: 'badgeBgColor',
          label: 'Badge Background Color',
        }),
        colorPickerField({
          name: 'badgeTextColor',
          label: 'Badge Text Color',
        }),
        // Heading
        {
          name: 'headingRich',
          type: 'richText',
          label: 'Heading (Rich Text)',
          admin: {
            description: 'Main heading — use bold for emphasis words (e.g. "eSkooly is a **revolution** in education **management**")',
          },
        },
        // Feature rows
        {
          name: 'features',
          type: 'array',
          label: 'Feature Rows',
          admin: { description: 'Add any number of icon + title + description rows' },
          fields: [
            {
              name: 'icon',
              type: 'upload',
              relationTo: 'media',
              label: 'Icon',
            },
            {
              name: 'iconType',
              type: 'select',
              label: 'Icon Source',
              defaultValue: 'upload',
              options: [
                { label: 'Upload SVG / PNG', value: 'upload' },
                { label: 'Lucide Icon', value: 'lucide' },
              ],
            },
            {
              name: 'lucideIcon',
              type: 'select',
              label: 'Lucide Icon',
              admin: {
                condition: (_, s) => s?.iconType === 'lucide',
              },
              options: [
                { label: 'None', value: '' },
                { label: 'Lightbulb', value: 'Lightbulb' },
                { label: 'Settings', value: 'Settings' },
                { label: 'TrendingUp', value: 'TrendingUp' },
                { label: 'Rocket', value: 'Rocket' },
                { label: 'Shield', value: 'Shield' },
                { label: 'Target', value: 'Target' },
                { label: 'Sparkles', value: 'Sparkles' },
                { label: 'Brain', value: 'Brain' },
                { label: 'Globe', value: 'Globe' },
                { label: 'Zap', value: 'Zap' },
                { label: 'Star', value: 'Star' },
                { label: 'Heart', value: 'Heart' },
                { label: 'Award', value: 'Award' },
                { label: 'Users', value: 'Users' },
                { label: 'CheckCircle', value: 'CheckCircle' },
                { label: 'BookOpen', value: 'BookOpen' },
                { label: 'GraduationCap', value: 'GraduationCap' },
                { label: 'Microscope', value: 'Microscope' },
                { label: 'BarChart', value: 'BarChart2' },
                { label: 'Layers', value: 'Layers' },
              ],
            },
            {
              name: 'titleRich',
              type: 'richText',
              label: 'Title (Rich Text)',
            },
            {
              name: 'descriptionRich',
              type: 'richText',
              label: 'Description (Rich Text)',
            },
          ],
        },
      ],
    },
  ],
}
