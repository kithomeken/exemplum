import React from "react"
import { Link } from "react-router-dom"

export const GetStarted = () => {

    return (
        <React.Fragment>
            <section className="py-20 overflow-hidden bg-gray-100 dark:bg-gray-800">
                <div className="container px-4 mx-auto">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex flex-wrap items-center -mx-5">
                            <div className="w-full lg:w-1/2 px-5 mb-20 lg:mb-0">
                                <div className="max-w-md">
                                    <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                                        Getting Started
                                    </span>

                                    <h2 className="mt-12 mb-10 text-5xl font-extrabold leading-tight text-gray-800 dark:text-gray-200">
                                        Launch Your Journey with Ease
                                    </h2>

                                    <p className="mb-16 text-lg text-gray-600 dark:text-gray-400">
                                        Sign up today and start connecting with your audience!
                                    </p>

                                    <Link to="/auth/sign-up" target="_blank" className="inline-block animate-bounce px-12 py-4 text-white font-bold bg-orange-600 hover:bg-orange-700 rounded-full shadow-lg transition duration-200">
                                        Get Started
                                    </Link>
                                </div>
                            </div>

                            <div className="w-full lg:w-1/2 px-5">
                                <ul>
                                    <li className="flex pb-10 mb-8 border-b border-gray-200 dark:border-gray-700">
                                        <div className="mr-8">
                                            <span className="flex justify-center items-center w-14 h-14 bg-orange-200/50 dark:bg-orange-600/30 text-lg font-bold rounded-full text-orange-600 dark:text-orange-300">1</span>
                                        </div>

                                        <div className="max-w-xs">
                                            <h3 className="mb-2 text-lg font-bold text-gray-700 dark:text-gray-300">Create Your Account</h3>
                                            <p className="text-lg text-gray-500 dark:text-gray-400">Sign up quickly and easily to access our full range of features.</p>
                                        </div>
                                    </li>

                                    <li className="flex pb-10 mb-8 border-b border-gray-200 dark:border-gray-700">
                                        <div className="mr-8">
                                            <span className="flex justify-center items-center w-14 h-14 bg-orange-200/50 dark:bg-orange-600/30 text-lg font-bold rounded-full text-orange-600 dark:text-orange-300">2</span>
                                        </div>
                                        <div className="max-w-xs">
                                            <h3 className="mb-2 text-lg font-bold text-gray-700 dark:text-gray-300">Personalize Your Experience</h3>
                                            <p className="text-lg text-gray-500 dark:text-gray-400">Tailor tools and settings to fit your needs and preferences.</p>
                                        </div>
                                    </li>

                                    <li className="flex pb-10 border-b border-gray-200 dark:border-gray-700">
                                        <div className="mr-8">
                                            <span className="flex justify-center items-center w-14 h-14 bg-orange-200/50 dark:bg-orange-600/30 text-lg font-bold rounded-full text-orange-600 dark:text-orange-300">3</span>
                                        </div>
                                        <div className="max-w-xs">
                                            <h3 className="mb-2 text-lg font-bold text-gray-700 dark:text-gray-300">Collaborate with Your Team</h3>
                                            <p className="text-lg text-gray-500 dark:text-gray-400">
                                                Bring in your team, collaborate seamlessly to boost productivity
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </React.Fragment>
    )
}