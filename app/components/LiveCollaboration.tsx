import React from 'react'
import Buttons from './Buttons'

const LiveCollaboration = () => {
  return (
    <div>
        <Buttons className=' flex justify-start font-serif text-gray-400 text-sm hover:text-white h-12 hover:cursor-pointer bg-transparent hover:bg-[#3b3c41] px-2.5 py-1.5 rounded-lg  w-56'
        onClick={() => alert("Sign In functionality coming soon!")}
        >
            <i className='ri-group-line mr-2'></i>
            Live Collaboration
        </Buttons>
    </div>
  )
}

export default LiveCollaboration;