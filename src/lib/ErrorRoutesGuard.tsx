import React from "react";
import { Outlet } from "react-router";

export default function ErrorRoutesGuard() {

    return (
        <div className="flex h-screen">
            <div className="flex flex-col w-full md:flex-row overflow-hidden">
                <main className="w-full h-full px-4 overflow-y-auto border-gray-200 md:border-l">
                    <div className="container h-full mx-auto border-t md:border-t-0 pb-16">

                        <Outlet />

                    </div>
                </main>
            </div>
        </div>
    )
}