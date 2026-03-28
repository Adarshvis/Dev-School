// Helper to convert Lexical richText to HTML
export function lexicalToHtml(lexicalData: any): string {
  if (!lexicalData) return ''
  
  // If it's already a string, return it
  if (typeof lexicalData === 'string') return lexicalData
  
  // If it has a root node, process it
  if (lexicalData.root) {
    return processNode(lexicalData.root)
  }
  
  return ''
}

// Get alignment style from format (string or number)
function getAlignmentStyle(format: string | number | undefined): string {
  if (!format) return ''
  // Handle string format (Lexical uses strings like 'center', 'right', 'left', 'justify')
  if (typeof format === 'string') {
    switch (format) {
      case 'left': return 'text-align: left;'
      case 'center': return 'text-align: center;'
      case 'right': return 'text-align: right;'
      case 'justify': return 'text-align: justify;'
      case 'start': return 'text-align: left;'
      case 'end': return 'text-align: right;'
      default: return ''
    }
  }
  // Handle number format (legacy)
  switch (format) {
    case 1: return 'text-align: left;'
    case 2: return 'text-align: center;'
    case 3: return 'text-align: right;'
    case 4: return 'text-align: justify;'
    default: return ''
  }
}

function processNode(node: any): string {
  if (!node) return ''
  
  // Handle text nodes
  if (node.type === 'text') {
    let text = node.text || ''
    
    // Apply formatting (bitmask values)
    if (node.format) {
      if (node.format & 1) text = `<strong>${text}</strong>` // Bold
      if (node.format & 2) text = `<em>${text}</em>` // Italic
      if (node.format & 4) text = `<s>${text}</s>` // Strikethrough
      if (node.format & 8) text = `<u>${text}</u>` // Underline
      if (node.format & 16) text = `<code>${text}</code>` // Code
      if (node.format & 32) text = `<sub>${text}</sub>` // Subscript
      if (node.format & 64) text = `<sup>${text}</sup>` // Superscript
    }
    
    // Apply inline styles (font color, background color, etc.)
    if (node.style) {
      text = `<span style="${node.style}">${text}</span>`
    }
    
    return text
  }

  // Handle horizontal rule
  if (node.type === 'horizontalrule') {
    return '<hr />'
  }

  // Handle upload nodes (images, files)
  if (node.type === 'upload') {
    const value = node.value
    if (value && typeof value === 'object') {
      const imageUrl = value.url || (value.sizes?.large?.url) || (value.sizes?.medium?.url)
      const alt = value.alt || value.filename || 'Image'
      const caption = value.caption
      
      if (imageUrl) {
        let html = `<img src="${imageUrl}" alt="${alt}" class="img-fluid" loading="lazy" style="max-height: 400px; width: 100%; object-fit: contain;" />`
        if (caption) {
          html += `<p class="text-center text-muted mt-2"><small>${caption}</small></p>`
        }
        return html
      }
    }
    return ''
  }
  
  // Handle container nodes with children
  const children = node.children?.map((child: any) => processNode(child)).join('') || ''
  
  // Get alignment style for block elements
  const alignStyle = getAlignmentStyle(node.format)
  const styleAttr = alignStyle ? ` style="${alignStyle}"` : ''
  
  switch (node.type) {
    case 'root':
      return children
    case 'paragraph':
      return `<p${styleAttr}>${children}</p>`
    case 'heading':
      const tag = node.tag || 'h2'
      return `<${tag}${styleAttr}>${children}</${tag}>`
    case 'list':
      const listTag = node.listType === 'number' ? 'ol' : 'ul'
      return `<${listTag}${styleAttr}>${children}</${listTag}>`
    case 'listitem':
      return `<li>${children}</li>`
    case 'quote':
    case 'blockquote':
    case 'block-quote':
      return `<blockquote${styleAttr}>${children}</blockquote>`
    case 'link':
      const url = node.fields?.url || node.url || '#'
      const target = node.fields?.newTab ? ' target="_blank" rel="noopener noreferrer"' : ''
      return `<a href="${url}"${target}>${children}</a>`
    case 'linebreak':
      return '<br />'
    default:
      return children
  }
}
