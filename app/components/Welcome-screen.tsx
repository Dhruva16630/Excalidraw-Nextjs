import LiveCollaboration from "./LiveCollaboration";
import SignInButton from "./SignInButton";

export const MainMenuWelcome = () => {
    return (
        <div className=" hidden md:fixed top-14 left-6 md:flex items-center-safe ">
            <svg className="text-gray-500 max-w-11 ">
                <defs>
                    <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="5"
                        refY="3.5"
                        orient="auto"
                        fill="currentColor"
                    >
                        <polygon points="0 0, 10 3.5, 0 7" />
                    </marker>
                </defs>

                <path
                    d="M38.5 83.5c-14-2-17.833-10.473-21-22.5C14.333 48.984 12 22 12 12.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                    markerEnd="url(#arrowhead)"
                />
            </svg>

            <p className="excalifont text-gray-500 fixed left-18 top-32 text-md md:w-32 ">
                Sign In, Github, X, Linkedin
            </p>
        </div>
    );
};



export const ToolMenuWelcome = () => {
    return (
        <div className="hidden md:fixed top-18 md:left-1/2 md:flex items-center-safe ">
            <svg className="text-gray-500">
                <defs>
                    <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="5"
                        refY="3.5"
                        orient="auto"
                        fill="currentColor"
                    >
                        <polygon points="0 0, 10 3.5, 0 7" />
                    </marker>
                </defs>

                <path
                    d="M1 77c14-2 31.833-11.973 35-24 3.167-12.016-6-35-9.5-43.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                    markerEnd="url(#arrowhead)"
                />
            </svg>


            {/* <p className="excalifont text-gray-500 md:fixed md:left-2/6 2xl:left-[calc(100% - 50%)] lg:left-2/5 xl:left-5/12 text-md "> */}
            <p className="excalifont text-gray-500 md:fixed md:left-2/6 2xl:left-[calc(100%-55%)] lg:left-2/5 xl:left-5/12 text-md">
                Pick a tool & <br /> Start Drawing !
            </p>
        </div>
    )
}





// export const ZoomMenuWelcome = () => {
//     return (
//         <div className="fixed bottom-5 left-12 flex items-center-safe ">
//             <svg className="text-gray-500 ">
//                 <defs>
//                     <marker
//                         id="arrowhead"
//                         markerWidth="10"
//                         markerHeight="7"
//                         refX="5"
//                         refY="3.5"
//                         orient="auto"
//                         fill="currentColor"
//                     >
//                         <polygon points="0 0, 10 3.5, 0 7" />
//                     </marker>
//                 </defs>

//                 <path
//                     d="M90 50 C70 50, 50 40, 40 100"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     fill="none"
//                     markerEnd="url(#arrowhead)"
//                 />
//             </svg>



//             <p className="excalifont text-gray-500 fixed left-36 bottom-24 text-md ">
//                 Zooom in, Zoom out & <br /> Reset Zoom
//             </p>
//         </div>
//     )
// }


export function HomeWelcome() {
    return (
        <div className="fixed excalifont top-7/12 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center-safe text-white text-3xl md:text-4xl">
            <div className="flex flex-row items-center">
                {/* <img src="" alt="Logo1" className="w-20 h-20" /> */}
                <h1>SKETCHYBOARD</h1>
            </div>
            <h5 className="text-gray-500 text-lg text-center excalifont mt-2">Everything is kept <span className="text-[#a8a5ff] mr-1.5">PRIVATE</span>
                and stored only on your device.</h5>
            <div className="mt-7 gap-1">
                <SignInButton />
                <LiveCollaboration />
            </div>

        </div>

    )
}



// export function HomeWelcome() {
//     return (
//         <div className="fixed excalifont top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center-safe text-white text-4xl">
//             <div className="flex flex-row items-center gap-3">
//                 {/* Logo container */}
//                 <div className="relative w-20 h-20">
//                     {/* First logo */}
//                     <img
//                         src="Image/Logo.png"
//                         alt="Logo1"
//                         className="absolute top-0 left-0 w-20 h-20"
//                     />
//                     {/* Second logo rotated */}
//                     <img
//                         src="Image/Logo.png"
//                         alt="Logo2"
//                         className="absolute top-0 left-0 w-20 h-20 rotate-90"
//                     />
//                 </div>

//                 {/* Text */}
//                 <h1>SKETCHYBOARD</h1>
//             </div>
//         </div>
//     )
// }
