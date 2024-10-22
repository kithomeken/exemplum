import { Link } from "react-router-dom"
import React, { useEffect, useState } from "react"

import { APPLICATION } from "../../global/ConstantsRegistry"

export const LandingHeader = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <React.Fragment>
            <nav className={`fixed z-10 top-0 left-0 w-full transition duration-300 ${scrolled ? 'backdrop-blur-md bg-white/70' : 'bg-transparent'}`} >
                <div className="w-full mx-auto md:py-2 py-1.5 container md:max-w-4xl lg:max-w-4xl xl:max-w-5xl">
                    <div className="max-w-full mx-auto md:px-4 px-2">
                        <div className="relative flex items-center justify-between h-16">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                <button
                                    type="button"
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                    aria-controls="mobile-menu"
                                    aria-expanded={isMenuOpen ? 'true' : 'false'}
                                >
                                    <span className="sr-only">Open main menu</span>
                                    {isMenuOpen ? (
                                        <svg
                                            className="block h-6 w-6"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="block h-6 w-6"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M4 6h16M4 12h16M4 18h16"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="hidden sm:block">
                                    <div className="flex space-x-4">
                                        <Link to="/" className="text-orange-500 mb-0 font-medium px-0 py-2 rounded-md" aria-current="page">
                                            <span className="text-3xl">{APPLICATION.NAME}</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden sm:flex absolute inset-y-0 right-0 items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 gap-x-6">
                                <Link to="/auth/sign-in" className="text-orange-600 hover:text-orange-700">
                                    Sign In
                                </Link>

                                <Link to="/auth/sign-up" className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">
                                    Create an Account
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {
                    isMenuOpen && (
                        <div className="sm:hidden absolute top-16 left-0 w-full bg-white shadow-lg px-3 pb-2">
                            <div className="flex flex-col items-start space-y-4 py-4 px-6">
                                <Link to="/auth/sign-in" className="text-gray-600 hover:text-gray-700 hover:underline focus:underline" onClick={() => setIsMenuOpen(false)}>
                                    Sign In
                                </Link>

                                <Link to="/auth/sign-up" className="text-orange-600 hover:text-gray-700 hover:underline focus:underline" onClick={() => setIsMenuOpen(false)}>
                                    Create an Account
                                </Link>
                            </div>
                        </div>
                    )
                }
            </nav>
        </React.Fragment>
    )
}