import React from "react"

export const WhoWeAre = () => {

    return (
        <React.Fragment>
            <div className="px-4 pt-24 mx-auto relative isolate">
                <svg
                    aria-hidden="true"
                    className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
                >
                    <defs>
                        <pattern
                            id="wave-pattern"
                            width="200"
                            height="200"
                            patternUnits="userSpaceOnUse"
                        >
                            <path
                                d="M 0 50 Q 50 0 100 50 T 200 50"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1"
                            />
                        </pattern>
                    </defs>
                    <rect
                        width="100%"
                        height="100%"
                        fill="url(#wave-pattern)"
                        className="fill-gray-50"
                    />
                </svg>

            </div>
        </React.Fragment>
    )
}