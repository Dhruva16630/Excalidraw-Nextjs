import React, { useState } from 'react'
import Buttons from './Buttons'
import MenuBar from './MenuBar'

const Menu = () => {
    const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
        <Buttons className='text-gray-300 text-md bg-[#232329] hover:bg-[#3b3c41] px-2.5 py-1.5 rounded-lg'
        onClick={() => setIsOpen(!isOpen)}
        >
            <i className='ri-menu-line'></i>
        </Buttons>
        {isOpen && <MenuBar/>}
    </div>
  )
}

export default Menu;