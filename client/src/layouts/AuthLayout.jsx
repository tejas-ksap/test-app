import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    return (
        <div className="flex items-center justify-center bg-[#F3F4F6] py-2 px-4 sm:px-8 font-body antialiased min-h-[calc(100vh-124px)]">
            <div className="flex w-full max-w-[950px] bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden transform scale-90 sm:scale-100 origin-center lg:origin-top">
                {/* Left Side (Image & Brand) - Persistent */}
                <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-gradient-to-br from-[#EAE9FE] to-[#D6E0FF] relative p-6">
                    {/* Arch Image Container */}
                    <div className="w-[240px] h-[280px] mb-4 overflow-hidden rounded-t-[120px] rounded-b-[30px] shadow-lg border-4 border-white flex-shrink-0">
                        <img
                            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
                            alt="Premium Building"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="text-center z-10 px-6 mt-4">
                        <h2 className="text-xl font-bold text-gray-900 mb-2 font-display">
                            Smart Living Management
                        </h2>
                        <p className="text-xs text-gray-600 leading-relaxed font-body">
                            Streamline your PG operations with our premium automated solution.
                        </p>
                    </div>
                </div>

                {/* Right Side (Dynamic Content via Outlet) */}
                <div className="flex flex-col justify-center w-full md:w-1/2 p-6 sm:p-10 lg:p-12">
                    <div className="w-full max-w-[360px] mx-auto">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
