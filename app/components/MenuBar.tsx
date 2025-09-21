import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

const MenuBar = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return createPortal(
    <div
      className="fixed left-4 md:top-14 bottom-14  bg-[#232329] text-gray-300 p-3 rounded-lg flex flex-col gap-2"
      style={{ zIndex: 9999999 }} // very high so it's always on top
    >
      <a href="https://github.com/Dhruva16630" target="_blank" rel="noreferrer">
        <h5><i className="ri-github-fill mr-3 text-xl"></i>Github</h5>
      </a>
      <a href="https://x.com/chandru_dh24491" target="_blank" rel="noreferrer">
        <h5><i className="ri-twitter-x-fill mr-3 text-lg"></i>X (Twitter)</h5>
      </a>
      <a href="https://www.linkedin.com/in/dhruva-kumar-c-041491264/" target="_blank" rel="noreferrer">
        <h5><i className="ri-linkedin-box-fill mr-3 text-xl"></i>LinkedIn</h5>
      </a>
      <hr className="border-gray-700" />
    </div>,
    document.body
  )
}

export default MenuBar
