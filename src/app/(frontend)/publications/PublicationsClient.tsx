'use client'

import * as React from 'react'
import { useState, useMemo } from 'react'

interface Publication {
  id: string
  title: string
  publisher: string
  authors: { name: string; isLabMember: boolean }[]
  keywords: { keyword: string }[]
  year: number
  type: string
  abstract?: string
  doi?: string
  link?: string
  citationCount?: number
}

interface DynamicFilters {
  years: number[]
  types: string[]
  authors: string[]
  keywords: string[]
}

interface PublicationsClientProps {
  publications: Publication[]
  dynamicFilters: DynamicFilters
}

export default function PublicationsClient({
  publications,
  dynamicFilters,
}: PublicationsClientProps) {
  // Filter state
  const [timeFilter, setTimeFilter] = useState<string>('any')
  const [customYearStart, setCustomYearStart] = useState<number>(2020)
  const [customYearEnd, setCustomYearEnd] = useState<number>(new Date().getFullYear())
  const [showCustomRange, setShowCustomRange] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([])
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 20
  const columns = {
    showPublication: true,
    showPublisher: true,
    showAuthors: true,
    showKeywords: true,
    showYear: true,
    showType: false,
    showCitations: false,
  }

  // Time filter options
  const timeOptions = [
    { label: 'Any time', value: 'any' },
    { label: 'Since 2026', value: '2026' },
    { label: 'Since 2025', value: '2025' },
    { label: 'Since 2024', value: '2024' },
    { label: 'Since 2022', value: '2022' },
    { label: 'Custom range...', value: 'custom' },
  ]

  // Type options
  const typeOptions = [
    { label: 'Journal Article', value: 'journal' },
    { label: 'Conference Paper', value: 'conference' },
    { label: 'Book Chapter', value: 'book-chapter' },
    { label: 'Technical Report', value: 'technical-report' },
    { label: 'Thesis', value: 'thesis' },
  ]

  // Author options (dynamic from data)
  const authorOptions = dynamicFilters.authors

  // Keyword options (dynamic from data)
  const keywordOptions = dynamicFilters.keywords

  // Sort options
  const sortOptions = [
    { label: 'Sort by relevance', value: 'relevance' },
    { label: 'Sort by date', value: 'date' },
  ]

  // Filter and sort publications
  const filteredPublications = useMemo(() => {
    let result = [...publications]

    // Time filter
    if (timeFilter !== 'any') {
      if (timeFilter === 'custom') {
        result = result.filter(p => p.year >= customYearStart && p.year <= customYearEnd)
      } else {
        const sinceYear = parseInt(timeFilter)
        result = result.filter(p => p.year >= sinceYear)
      }
    }

    // Type filter
    if (selectedTypes.length > 0) {
      result = result.filter(p => selectedTypes.includes(p.type))
    }

    // Author filter
    if (selectedAuthors.length > 0) {
      result = result.filter(p => 
        p.authors?.some(author => selectedAuthors.includes(author.name))
      )
    }

    // Keyword filter
    if (selectedKeywords.length > 0) {
      result = result.filter(p => 
        p.keywords?.some(k => selectedKeywords.includes(k.keyword))
      )
    }

    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.publisher.toLowerCase().includes(query) ||
        p.authors?.some(a => a.name.toLowerCase().includes(query)) ||
        p.keywords?.some(k => k.keyword.toLowerCase().includes(query))
      )
    }

    // Sort
    if (sortBy === 'date') {
      result.sort((a, b) => b.year - a.year)
    } else if (sortBy === 'relevance') {
      // Sort by citation count for relevance
      result.sort((a, b) => (b.citationCount || 0) - (a.citationCount || 0))
    }

    return result
  }, [publications, timeFilter, customYearStart, customYearEnd, selectedTypes, selectedAuthors, selectedKeywords, searchQuery, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredPublications.length / itemsPerPage)
  const paginatedPublications = filteredPublications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Handle checkbox toggle
  const toggleFilter = (value: string, selected: string[], setSelected: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (selected.includes(value)) {
      setSelected(selected.filter(v => v !== value))
    } else {
      setSelected([...selected, value])
    }
    setCurrentPage(1)
  }

  // Handle time filter change
  const handleTimeFilterChange = (value: string) => {
    if (value === 'custom') {
      setShowCustomRange(true)
    } else {
      setShowCustomRange(false)
    }
    setTimeFilter(value)
    setCurrentPage(1)
  }

  // Get type label
  const getTypeLabel = (value: string) => {
    const option = typeOptions.find(t => t.value === value)
    return option?.label || value
  }

  return (
    <div className="row">
      {/* Filters Sidebar */}
      <div className="col-lg-3">
        <div className="publications-filters" data-aos="fade-right" data-aos-delay="100">
          
          {/* Time Filter */}
          <div className="filter-group">
            <h5 style={{ color: '#011e2c', fontWeight: 600 }}>Time</h5>
            <div className="filter-options">
              {timeOptions.map((option, index) => (
                <label key={index} className="filter-radio">
                  <input 
                    type="radio" 
                    name="timeFilter"
                    checked={timeFilter === option.value}
                    onChange={() => handleTimeFilterChange(option.value)}
                  />
                  <span className="radio-label" style={{ color: timeFilter === option.value ? '#011e2c' : '#666' }}>
                    {option.label}
                  </span>
                </label>
              ))}
              
              {/* Custom Range Picker */}
              {showCustomRange && (
                <div className="custom-range-picker mt-2 p-2" style={{ background: '#f8f9fa', borderRadius: '4px' }}>
                  <div className="d-flex gap-2 align-items-center">
                    <input 
                      type="number" 
                      min="1990" 
                      max={new Date().getFullYear()}
                      value={customYearStart}
                      onChange={(e) => { setCustomYearStart(parseInt(e.target.value)); setCurrentPage(1); }}
                      style={{ width: '80px', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                    <span>to</span>
                    <input 
                      type="number" 
                      min="1990" 
                      max={new Date().getFullYear()}
                      value={customYearEnd}
                      onChange={(e) => { setCustomYearEnd(parseInt(e.target.value)); setCurrentPage(1); }}
                      style={{ width: '80px', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Publication Type Filter */}
          <div className="filter-group mt-4">
            <h5 style={{ color: '#011e2c', fontWeight: 600 }}>Publication Type</h5>
            <div className="filter-options">
              {typeOptions.map((option, index) => (
                <label key={index} className="filter-checkbox">
                  <input 
                    type="checkbox"
                    checked={selectedTypes.includes(option.value)}
                    onChange={() => toggleFilter(option.value, selectedTypes, setSelectedTypes)}
                  />
                  <span className="checkmark"></span>
                  <span style={{ color: selectedTypes.includes(option.value) ? '#011e2c' : '#666' }}>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Author Filter */}
          {authorOptions.length > 0 && (
            <div className="filter-group mt-4">
              <h5 style={{ color: '#011e2c', fontWeight: 600 }}>Author</h5>
              <div className="filter-options" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {authorOptions.map((author, index) => (
                  <label key={index} className="filter-checkbox">
                    <input 
                      type="checkbox"
                      checked={selectedAuthors.includes(author)}
                      onChange={() => toggleFilter(author, selectedAuthors, setSelectedAuthors)}
                    />
                    <span className="checkmark"></span>
                    <span style={{ color: selectedAuthors.includes(author) ? '#011e2c' : '#666' }}>
                      {author}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Keywords Filter */}
          {keywordOptions.length > 0 && (
            <div className="filter-group mt-4">
              <h5 style={{ color: '#011e2c', fontWeight: 600 }}>Keywords / Research Area</h5>
              <div className="filter-options" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {keywordOptions.map((keyword, index) => (
                  <label key={index} className="filter-checkbox">
                    <input 
                      type="checkbox"
                      checked={selectedKeywords.includes(keyword)}
                      onChange={() => toggleFilter(keyword, selectedKeywords, setSelectedKeywords)}
                    />
                    <span className="checkmark"></span>
                    <span style={{ color: selectedKeywords.includes(keyword) ? '#011e2c' : '#666' }}>
                      {keyword}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Sort Options */}
          <div className="filter-group mt-4">
            <h5 style={{ color: '#011e2c', fontWeight: 600 }}>Sort By</h5>
            <div className="filter-options">
              {sortOptions.map((option, index) => (
                <label key={index} className="filter-radio">
                  <input 
                    type="radio" 
                    name="sortBy"
                    checked={sortBy === option.value}
                    onChange={() => { setSortBy(option.value); setCurrentPage(1); }}
                  />
                  <span className="radio-label" style={{ color: sortBy === option.value ? '#011e2c' : '#666' }}>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          <button 
            className="btn btn-sm mt-4 w-100"
            style={{ backgroundColor: '#011e2c', color: '#fff' }}
            onClick={() => {
              setTimeFilter('any')
              setShowCustomRange(false)
              setSelectedTypes([])
              setSelectedAuthors([])
              setSelectedKeywords([])
              setSearchQuery('')
              setSortBy('date')
              setCurrentPage(1)
            }}
          >
            Clear All Filters
          </button>
        </div>
      </div>

      {/* Publications List */}
      <div className="col-lg-9">
        {/* Search and Results Count */}
        <div className="publications-header mb-4" data-aos="fade-left" data-aos-delay="100">
          <div className="d-flex flex-wrap gap-3 justify-content-between align-items-center">
            <div className="search-box flex-grow-1" style={{ maxWidth: '400px' }}>
              <div className="input-group">
                <span className="input-group-text" style={{ backgroundColor: '#011e2c', borderColor: '#011e2c', color: '#fff' }}>
                  <i className="bi bi-search"></i>
                </span>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Search publications..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  style={{ borderColor: '#011e2c' }}
                />
              </div>
            </div>
            <div className="results-count" style={{ color: '#666' }}>
              Showing {paginatedPublications.length} of {filteredPublications.length} publications
            </div>
          </div>
        </div>

        {/* Publications Table */}
        <div className="publications-table-wrapper" style={{ overflowX: 'auto' }}>
          <table className="publications-table" style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#011e2c', color: '#fff' }}>
                {columns.showPublication && (
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>
                    Publication <i className="bi bi-arrow-down-up ms-1" style={{ fontSize: '12px' }}></i>
                  </th>
                )}
                {columns.showPublisher && (
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>
                    Publisher <i className="bi bi-arrow-down-up ms-1" style={{ fontSize: '12px' }}></i>
                  </th>
                )}
                {columns.showAuthors && (
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>
                    Author(s) <i className="bi bi-arrow-down-up ms-1" style={{ fontSize: '12px' }}></i>
                  </th>
                )}
                {columns.showKeywords && (
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>
                    Keyword(s) <i className="bi bi-arrow-down-up ms-1" style={{ fontSize: '12px' }}></i>
                  </th>
                )}
                {columns.showYear && (
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>
                    Year <i className="bi bi-arrow-down-up ms-1" style={{ fontSize: '12px' }}></i>
                  </th>
                )}
                {columns.showType && (
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>
                    Type
                  </th>
                )}
                {columns.showCitations && (
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>
                    Citations
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedPublications.length > 0 ? (
                paginatedPublications.map((pub, index) => (
                  <tr 
                    key={pub.id || index} 
                    style={{ 
                      backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa',
                      borderBottom: '1px solid #eee',
                    }}
                  >
                    {columns.showPublication && (
                      <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                        {pub.link || pub.doi ? (
                          <a 
                            href={pub.link || `https://doi.org/${pub.doi}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: '#011e2c', textDecoration: 'none' }}
                          >
                            {pub.title}
                          </a>
                        ) : (
                          pub.title
                        )}
                      </td>
                    )}
                    {columns.showPublisher && (
                      <td style={{ padding: '12px 16px', color: '#666' }}>
                        {pub.publisher}
                      </td>
                    )}
                    {columns.showAuthors && (
                      <td style={{ padding: '12px 16px', color: '#666' }}>
                        {pub.authors?.map(a => a.name).join(', ')}
                      </td>
                    )}
                    {columns.showKeywords && (
                      <td style={{ padding: '12px 16px', color: '#666' }}>
                        {pub.keywords?.map(k => k.keyword).join(', ')}
                      </td>
                    )}
                    {columns.showYear && (
                      <td style={{ padding: '12px 16px', color: '#666' }}>
                        {pub.year}
                      </td>
                    )}
                    {columns.showType && (
                      <td style={{ padding: '12px 16px', color: '#666' }}>
                        {getTypeLabel(pub.type)}
                      </td>
                    )}
                    {columns.showCitations && (
                      <td style={{ padding: '12px 16px', color: '#666' }}>
                        {pub.citationCount || 0}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td 
                    colSpan={7} 
                    style={{ padding: '40px', textAlign: 'center', color: '#666' }}
                  >
                    No publications found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="publications-pagination mt-4 d-flex justify-content-center">
            <nav>
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    style={{ color: '#011e2c' }}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  return (
                    <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => setCurrentPage(pageNum)}
                        style={{ 
                          backgroundColor: currentPage === pageNum ? '#011e2c' : 'transparent',
                          borderColor: '#011e2c',
                          color: currentPage === pageNum ? '#fff' : '#011e2c',
                        }}
                      >
                        {pageNum}
                      </button>
                    </li>
                  )
                })}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    style={{ color: '#011e2c' }}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Styles */}
      <style jsx>{`
        .publications-filters {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          position: sticky;
          top: 100px;
        }
        
        .filter-group {
          border-bottom: 1px solid #eee;
          padding-bottom: 16px;
        }
        
        .filter-group:last-of-type {
          border-bottom: none;
        }
        
        .filter-radio,
        .filter-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .filter-radio input,
        .filter-checkbox input {
          accent-color: #011e2c;
          width: 16px;
          height: 16px;
        }
        
        .publications-table-wrapper {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        }
        
        .publications-table tbody tr:hover {
          background-color: #e8f4f8 !important;
        }
        
        .pagination .page-link:focus {
          box-shadow: 0 0 0 0.2rem rgba(1, 30, 44, 0.25);
        }
      `}</style>
    </div>
  )
}
