import React from "react"
import { Link } from "react-router-dom"
import { APPLICATION } from "../../global/ConstantsRegistry"

export const Footer = () => {

    return (
        <React.Fragment>
            <div className="w-full px-3 py-5 bg-orange-100">
                <div className="mx-auto container md:text-xl text-base md:max-w-4xl lg:max-w-4xl xl:max-w-5xl pb-5">
                    <div className="max-w-screen-lg text-base text-gray-800 sm:grid md:grid-cols-3 sm:grid-cols-2 mx-auto">
                        <div className="md:py-5 py-3">
                            <h1 className="pb-4 text-3xl font-medium tracking-tight text-orange-600 sm:text-3xl">
                                {APPLICATION.NAME}

                                <span className="block text-sm text-gray-800 py-2 font-normal tracking-wide">
                                    © {new Date().getFullYear()} All Right Reserved.
                                </span>
                            </h1>
                        </div>

                        <div className="md:py-5 py-0">
                            <div className="text-sm uppercase text-orange-600 font-semibold">Resources</div>
                            <a className="my-3 block" href="/#">FAQs <span className="text-blue-600 text-xs p-1"></span></a>
                            <a className="my-3 block" href="/#">About Us <span className="text-blue-600 text-xs p-1"></span></a>
                            <a className="my-3 block" href="/#">Terms & Conditions <span className="text-blue-600 text-xs p-1"></span></a>
                        </div>

                        <div className="md:py-5 py-4">
                            <div className="text-sm uppercase text-orange-600 font-semibold">Contact us</div>
                            <a className="my-3 block" href="/#">
                                XXX XXXX, Floor 4 San Francisco, CA
                                <span className="text-blue-600 text-xs p-1"></span>
                            </a>
                            <a className="my-3 block" href="/#">contact@company.com
                                <span className="text-blue-600 text-xs p-1"></span>
                            </a>
                        </div>
                    </div>

                    <div className="pt-2">
                        <div className="flex flex-col items-center max-w-screen-lg m-auto pt-5 pb-5 px-3 text-sm text-gray-800 border-t border-orange-300">
                            <div className="flex flex-row md:flex-row-reverse mt-2">
                                {[
                                    {
                                        href: "/#",
                                        name: "fa-twitter",
                                        id: "Twitter"
                                    },
                                    {
                                        href: "/#",
                                        name: "fa-facebook",
                                        id: "Facebook"
                                    },
                                    {
                                        href: "/#",
                                        name: "fa-instagram",
                                        id: "Instagram"
                                    },
                                ].map((icon, index) => (
                                    <Link key={index} to={icon.href} className="w-6 mx-1">
                                        <span className={`fa-brands fa-xl ${icon.name}`}></span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </React.Fragment>
    )
}