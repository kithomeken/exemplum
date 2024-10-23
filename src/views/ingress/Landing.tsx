import React from "react"

import { HowItWorks } from "./HowItWorks"
import { LandingHeader } from "./LandingHeader"
import happMusic from "../../assets/images/YFAheV0zeqUnWn4BI.svg"
import { OurVision } from "./OurVision"
import { Footer } from "./Footer"

export const Landing = () => {


    return (
        <React.Fragment>
            <div className="flex h-screen w-full">

                <LandingHeader />

                <div className="flex flex-col w-full relative isolate">
                    <div className="absolute inset-0 -z-10 overflow-hidden">
                        <svg
                            aria-hidden="true"
                            className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
                        >
                            <defs>
                                <pattern
                                    x="50%"
                                    y={-1}
                                    id="e813992c-7d03-4cc4-a2bd-151760b470a0"
                                    width={200}
                                    height={200}
                                    patternUnits="userSpaceOnUse"
                                >
                                    <path d="M100 200V.5M.5 .5H200" fill="none" />
                                </pattern>
                            </defs>
                            <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
                                <path
                                    d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                                    strokeWidth={0}
                                />
                            </svg>
                            <rect fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" width="100%" height="100%" strokeWidth={0} />
                        </svg>
                    </div>

                    <div className="w-full flex-grow">
                        <main className="md:h-[calc(100vh-80px)] h-[calc(100vh-40px)] px-3 pt-24 mx-auto flex flex-col md:flex-row items-center align-middle container md:max-w-4xl lg:max-w-4xl xl:max-w-5xl">
                            <div className="md:basis-1/2">
                                <h1 className="md:mt-2 mt-6 text-3xl font-bold tracking-tight text-orange-600 sm:text-4xl">
                                    Elevated acts of appreciation
                                </h1>

                                <p className="mt-6 md:text-xl text-lg leading-8 text-gray-700 pb-3 md:py-0">
                                    Engage your audience, giving them a way to express their gratitude and offer encouragement directly.
                                </p>
                            </div>

                            <div className="md:basis-1/2 md:block h-full px-4 py-6">
                                <img className="h-full rounded-2xl" src={happMusic} alt={"happy_music"} loading="lazy" />
                            </div>
                        </main>

                        <div className="w-full px-3 py-5 bg-orange-100">
                            <div className="mx-auto container md:text-xl text-base md:max-w-4xl lg:max-w-4xl xl:max-w-5xl pb-5">
                                <h1 className="mt-2 text-2xl font-bold tracking-tight text-orange-600 sm:text-3xl">
                                    Your stage, their support
                                    {/* Championing Creators, Empowering Fans */}
                                </h1>

                                <p className="mt-6 leading-8 text-gray-700">
                                    <span className="text-orange-600">
                                        <span className="font-bold text-xl md:text-2xl">B</span>igfan
                                    </span> is a platform crafted to empower creatives—whether you're a musician, DJ, actor, influencer, content creator, or event organizer—by turning every interaction into a meaningful connection. It fosters a culture where creativity is recognized and celebrated, turning moments of connection into meaningful support for the artistry that inspires them.
                                </p>

                                <p className="mt-6 leading-8 text-gray-700">
                                    By turning each moment of artistic expression into an opportunity for support, Bigfan allows audiences to directly show appreciation and encouragement, driving deeper engagement and recognition for every creation.
                                </p>
                            </div>
                        </div>

                        <HowItWorks />

                        <Footer />

                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}