import React from 'react'

export default function MinimalLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <a className="navbar-brand" href="/">Learner</a>
        </div>
      </nav>
      <main>{children}</main>
      <footer className="bg-dark text-white text-center py-3">
        <p>&copy; 2024 Learner. All rights reserved.</p>
      </footer>
    </>
  )
}
