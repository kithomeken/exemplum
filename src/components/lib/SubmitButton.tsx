import React from "react"
import { FC } from "react"

interface Props {
    title: any,
    posting: boolean,
}

interface actionProps {
    title: any
}

export const SubmitButton: FC<Props> = ({ posting, title }) => {
    return (
        <React.Fragment>
            {
                posting ? (
                    <button type="button" className={`inline-flex items-center px-6 py-2 mt-3 text-white border border-green-600 rounded shadow-sm text-sm bg-green-600 focus:outline-none focus:ring-0`}>
                        <div className="flex flex-col align-middle py-2">
                            <span className="fa-duotone text-white fa-spinner-third fa-xl m-auto block fa-spin"></span>
                        </div>
                    </button>
                ) : (
                    <button type="submit" className={`inline-flex items-center px-6 py-1-5 mt-3 text-white border border-green-600 rounded shadow-sm text-sm bg-green-600 hover:border-green-700 hover:bg-green-700 focus:outline-none focus:ring-0 disabled:bg-green-400 disabled:border-green-400 disabled:cursor-not-allowed`}>
                        <span className="text-sm">
                            {title}
                        </span>
                    </button>
                )
            }
        </React.Fragment>
    )
}

export const ActionButton: FC<Props> = ({}) => {


    return (
        <React.Fragment>

        </React.Fragment>
    )
}