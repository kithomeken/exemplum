import React from "react"
import { Link } from "react-router-dom"
import { APPLICATION } from "../../global/ConstantsRegistry"

export const Footer = () => {

    return (
        <React.Fragment>
            <div className="w-full px-3 py-5 bg-orange-100">
                <div className="mx-auto container md:text-xl text-base md:max-w-4xl lg:max-w-4xl xl:max-w-5xl pb-5">
                    <h1 className="pb-4 pt-2 text-3xl font-medium tracking-tight text-orange-600 sm:text-3xl">
                        {APPLICATION.NAME}
                    </h1>

                    <div className="border-t border-orange-300 flex md:flex-row flex-col pt-3 text-base gap-x-3">
                        <span className="flex-none">
                            <span>© {new Date().getFullYear()}</span>
                        </span>

                        <span className="flex-none md:py-0 pt-3">
                            All Right Reserved.
                        </span>

                        <span className="flex-none md:py-0 pt-3">
                            <Link to={undefined} className="text-orange-600 hover:text-orange-700 hover:underline">Terms & Conditions</Link>
                        </span>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}