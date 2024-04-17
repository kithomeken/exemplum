import { Link } from "react-router-dom";
import React, { FC, useState } from "react";

import { AccountSubHeader } from "./AccountSubHeader";
import { APPLICATION } from "../../global/ConstantsRegistry";

interface headerProps {
    errorMode?: boolean,
    showSettings?: boolean,
}

export const Header: FC<headerProps> = ({ showSettings = true, errorMode = false }) => {
    const [state, setstate] = useState({
        show: {
            setting: false,
        }
    })

    return (
        <React.Fragment>
            <nav className="bg-white shadow fixed w-full z-10">
                <div className="max-w-full mx-auto md:px-4 px-2">
                    <div className="relative flex items-center justify-between h-16">
                        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                            <button type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                                <span className="sr-only">Open main menu</span>
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                                </svg>

                                <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                            <div className="hidden sm:block">
                                <div className="flex space-x-4">
                                    <Link to="/home" className="text-amber-500 mb-0 nunito font-bold px-0 py-2 rounded-md" aria-current="page">
                                        <span className="text-2xl">
                                            {APPLICATION.NAME}
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            <div className="ml-3 relative">
                                <div>

                                    <AccountSubHeader errorMode={errorMode} />

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </React.Fragment>
    )
}