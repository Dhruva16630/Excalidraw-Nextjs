import React from 'react'





const MenuBar = () => {
    
    return (
        <div className='fixed left-4 top-14 bg-[#232329] text-gray-300 p-3 rounded-lg flex flex-col gap-2 '>
            <h5><i className='ri-github-fill mr-3 text-xl'></i>Github</h5>
            <h5><i className='ri-twitter-x-fill mr-3 text-lg'></i>X ( Twitter )</h5>
            <h5><i className='ri-linkedin-box-fill mr-3 text-xl '></i>Linkedin</h5>
            <hr className='border-gray-700' />
            {/* <div className='flex flex-row items-center'>
                Theme 
                <div className='ml-8 flex gap-2 border border-gray-600 p-1 rounded-lg'>
                    <button onClick={()=>setTheme("light")}><i className='ri-sun-line px-1.5 py-1'></i></button>
                    <button onClick={()=>setTheme("dark")}><i className='ri-moon-line px-1.5 py-1'></i></button>
                    <button onClick={()=>setTheme("system")}><i className='ri-computer-line px-1.5 py-1'></i></button>
                </div>
            </div>
            <hr className='border-gray-700' />
            <div>
                Canvas background
                <div className='flex gap-1 mt-1'>
                    <div className='w-4 h-4 bg-red-500 rounded'></div>
                    <div className='w-4 h-4 bg-blue-500 rounded'></div>
                    <div className='w-4 h-4 bg-yellow-500 rounded'></div>
                    <div className='w-4 h-4 bg-orange-500 rounded'></div>
                    <div className='w-4 h-4 bg-green-500 rounded'></div>
                </div>

            </div> */}
        </div>
    )
}

export default MenuBar;