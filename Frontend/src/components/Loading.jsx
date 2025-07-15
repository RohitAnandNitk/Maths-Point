import React from 'react'

export default function Loading() {
    return (
        <div className="relative h-screen w-full flex items-center justify-center bg-white">
            {/* We need to include the keyframe animations in a style tag since Tailwind doesn't support these directly */}
            <style>
                {`
                    @keyframes dot1_ {
                        3%,97% {
                            width: 160px;
                            height: 100px;
                            margin-top: -50px;
                            margin-left: -80px;
                        }
                        30%,36% {
                            width: 80px;
                            height: 120px;
                            margin-top: -60px;
                            margin-left: -40px;
                        }
                        63%,69% {
                            width: 40px;
                            height: 80px;
                            margin-top: -40px;
                            margin-left: -20px;
                        }
                    }
                    @keyframes dot2_ {
                        3%,97% {
                            height: 90px;
                            width: 150px;
                            margin-left: -75px;
                            margin-top: -45px;
                        }
                        30%,36% {
                            width: 70px;
                            height: 96px;
                            margin-left: -35px;
                            margin-top: -48px;
                        }
                        63%,69% {
                            width: 32px;
                            height: 60px;
                            margin-left: -16px;
                            margin-top: -30px;
                        }
                    }
                    @keyframes dot3_ {
                        3%,97% {
                            height: 20px;
                            width: 40px;
                            margin-left: -20px;
                            margin-top: 50px;
                        }
                        30%,36% {
                            width: 8px;
                            height: 8px;
                            margin-left: -5px;
                            margin-top: 49px;
                            border-radius: 8px;
                        }
                        63%,69% {
                            width: 16px;
                            height: 4px;
                            margin-left: -8px;
                            margin-top: -37px;
                            border-radius: 10px;
                        }
                    }
                    .loader-1 {
                        animation: dot1_ 3s cubic-bezier(0.55,0.3,0.24,0.99) infinite;
                    }
                    .loader-2 {
                        animation: dot2_ 3s cubic-bezier(0.55,0.3,0.24,0.99) infinite;
                    }
                    .loader-3 {
                        animation: dot3_ 3s cubic-bezier(0.55,0.3,0.24,0.99) infinite;
                    }
                `}
            </style>
            {/* The divs with Tailwind classes for positioning and styling */}
            <div className="absolute top-1/2 left-1/2 z-10 w-40 h-24 rounded-md bg-[#1e3f57] loader-1" style={{ marginLeft: "-80px", marginTop: "-50px" }}></div>
            <div className="absolute top-1/2 left-1/2 z-20 w-[150px] h-[90px] rounded bg-[#3c517d] loader-2" style={{ marginLeft: "-75px", marginTop: "-45px" }}></div>
            <div className="absolute top-1/2 left-1/2 z-30 w-10 h-5 rounded-b bg-[#6bb2cd] loader-3" style={{ marginLeft: "-20px", marginTop: "50px" }}></div>
        </div>
    );
}
