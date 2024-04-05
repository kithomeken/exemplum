import React from "react";
import { Outlet } from "react-router";

export default function StandardRoutesGuard() {

    return (
        <div className="flex h-screen">
            <div className="flex flex-col w-full md:flex-row overflow-hidden">
                <div className="flex-shrink-0 w-full md:w-56">
                    <div className="p-4">
                        <h1 className="text-xl text-amber-600 font-medium tracking-wider">
                            Menu
                        </h1>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden py-3 h-screen">
                    <main className="flex-1 h-full px-4 overflow-y-auto border-gray-200 md:border-l">
                        <div className="container h-full mx-auto border-t md:border-t-0 pb-16">

                            <Outlet />

                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}