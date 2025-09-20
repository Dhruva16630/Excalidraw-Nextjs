// import React, { useState } from 'react'
// import Buttons from './Buttons'
// import MenuBar from './MenuBar'

// const Menu = () => {
//     const [isOpen, setIsOpen] = useState(false);
//   return (
//     <div>
//         <Buttons className='text-gray-300 text-md bg-[#232329] hover:bg-[#3b3c41] px-2.5 py-1.5 rounded-lg'
//         onClick={() => setIsOpen(!isOpen)}
//         >
//             <i className='ri-menu-line'></i>
//         </Buttons>
//         {isOpen && <MenuBar/>}
//     </div>
//   )
// }

// export default Menu;


import React, { useState, useRef, useEffect } from "react";
import Buttons from "./Buttons";
import MenuBar from "./MenuBar";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null); // ref for wrapping div

  useEffect(() => {
    function handleClickOutside(event:MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative">
      <Buttons
        className="text-gray-300 text-md bg-[#232329] hover:bg-[#3b3c41] px-2.5 py-1.5 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="ri-menu-line"></i>
      </Buttons>
      {isOpen && (
        <div className="absolute top-full left-0">
          <MenuBar />
        </div>
      )}
    </div>
  );
};

export default Menu;
