import { Link } from "react-router-dom"
import React, { useEffect, useState } from "react"

import colorfulLogo from "../../assets/images/1akbR3BuvCSqw5uGy.svg"

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
                        <div className="relative flex items-center justify-between md:h-24 h-16">
                            <div className="absolute inset-y-0 left-0 flex w-full items-center sm:hidden">
                                <div className="flex-grow">
                                    <Link to="/" className="mb-0 font-medium px-0 rounded-md" aria-current="page">
                                        <img className="h-12" src={colorfulLogo} loading="lazy" alt="colorful_logo" />
                                    </Link>
                                </div>

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
                                        <Link to="/" className="mb-0 font-medium px-0 py-2 rounded-md" aria-current="page">
                                            <img className="h-24  py-3 mx-auto" src={colorfulLogo} loading="lazy" alt="colorful_logo" />
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden sm:flex absolute inset-y-0 right-0 items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 gap-x-6">
                                <Link to="#" className="text-gray-600 font-semibold hover:text-orange-600">
                                    How it Works
                                </Link>

                                <Link to="#" className="text-gray-600 font-semibold hover:text-orange-600">
                                    FAQs
                                </Link>

                                <Link to="#" className="text-gray-600 font-semibold hover:text-orange-600">
                                    About Us
                                </Link>

                                <Link to="#" className="text-gray-600 font-semibold hover:text-orange-600">
                                    Contact Us
                                </Link>

                                <Link to="#" className="text-gray-600 font-semibold hover:text-orange-600 flex gap-x-3 items-center align-middle">
                                    <span className="fa-regular fa-search"></span> Search
                                </Link>

                                <Link to="/auth/sign-in" className="bg-orange-600 text-white hover:bg-orange-700 py-1.5 px-4 rounded-md">
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {
                    isMenuOpen && (
                        <div className="sm:hidden absolute top-[76px] left-0 w-full bg-white shadow-lg px-3 pb-2">
                            <div className="flex flex-col items-start space-y-4 py-4 px-6 w-full">
                                <Link to="#" className="text-gray-600 hover:text-gray-700 hover:underline focus:underline" onClick={() => setIsMenuOpen(false)}>
                                    How it Works
                                </Link>

                                <Link to="#" className="text-gray-600 hover:text-gray-700 hover:underline focus:underline" onClick={() => setIsMenuOpen(false)}>
                                    FAQs
                                </Link>

                                <Link to="#" className="text-gray-600 hover:text-gray-700 hover:underline focus:underline" onClick={() => setIsMenuOpen(false)}>
                                    About Us
                                </Link>

                                <Link to="#" className="text-gray-600 hover:text-gray-700 hover:underline focus:underline" onClick={() => setIsMenuOpen(false)}>
                                    Contact Us
                                </Link>

                                <Link to="#" className="text-gray-600 hover:text-gray-700 hover:underline focus:underline flex gap-x-3 items-center align-middle" onClick={() => setIsMenuOpen(false)}>
                                    <span className="fa-regular fa-search"></span> Search
                                </Link>

                                <div className="border-t pt-3 w-full">
                                    <Link to="/auth/sign-in" className="text-orange-600 hover:text-gray-700 hover:underline focus:underline" onClick={() => setIsMenuOpen(false)}>
                                        Sign In
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )
                }
            </nav>
        </React.Fragment>
    )
}