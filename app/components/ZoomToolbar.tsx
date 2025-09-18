import React from 'react'
import Buttons from './Buttons'


interface ZoomToolbarProps {
    zoomPercentage: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onResetZoom: () => void;
   
    
}


const ZoomToolbar:React.FC<ZoomToolbarProps> = ({
    zoomPercentage,
    onZoomIn,
    onZoomOut,
    onResetZoom
}) => {
  return (
    <div className='flex justify-center gap-2 text-gray-300 bg-[#232329] rounded-lg p-0.5 text-[15px] md:text-lg 2xl:text-xl'>
        <Buttons onClick={onZoomOut} className='relative group'   >
            <i className="ri-subtract-line rounded-lg hover:bg-[#3b3c41] px-2 py-1 " />
            <span className="absolute bottom-full left-full mb-1 hidden group-hover:block whitespace-nowrap text-xs border-1 border-white bg-[#3b3c41] text-white px-2 py-1">
                Zoom out - Ctrl+-
            </span>
        </Buttons>
        <Buttons onClick={onResetZoom} className='relative group text-[15px] '>
            {Math.round(zoomPercentage * 100)}%
            <span className="absolute bottom-full mb-2 hidden group-hover:block whitespace-nowrap text-sm rounded-lg  bg-black text-white px-2 py-1">
                Reset Zoom
            </span>
        </Buttons>
        <Buttons onClick={onZoomIn} className='relative group' >
            <i className=" ri-add-fill rounded-lg hover:bg-[#3b3c41] px-2 py-1" />
            <span className="absolute bottom-full left-full mb-1 hidden group-hover:block whitespace-nowrap text-xs border-1 border-white bg-[#3b3c41] text-white px-2 py-1">
                Zoom in - Ctrl++
            </span>
        </Buttons>
    </div>
  )
}

export default ZoomToolbar