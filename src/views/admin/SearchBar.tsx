import React, { FC } from "react"

import { classNames } from "../../lib/modules/HelperFunctions"
import { Search_Box_Props } from "../../lib/modules/Interfaces"

export const SearchBar: FC<Search_Box_Props> = ({
    state,
    formHandler,
    onInputBlur,
    onChangeHandler,
}) => {
    return (
        <React.Fragment>
            <form onSubmit={formHandler}>
                <div className="relative w-full flex flex-row-reverse md:gap-x-3 pt-3 bg-gray-50">
                    <button type="submit" className="w-auto disabled:cursor-not-allowed text-sm rounded-md shadow-sm px-3 py-2 bg-amber-500 text-white disabled:bg-amber-600 hover:bg-amber-600 focus:outline-none flex items-center justify-center" disabled={state.searching}>
                        {
                            state.searching ? (
                                <i className="fa-duotone fa-spinner-third fa-xl fa-spin"></i>
                            ) : (
                                <i className="fa-regular fa-magnifying-glass fa-xl"></i>
                            )
                        }
                    </button>

                    <div className="md:basis-1/4 w-full float-right">
                        <input type="text" name="search" id="search" placeholder="Search..." autoComplete="off" className={classNames(
                            'text-stone-900 ring-slate-300 placeholder:text-stone-500 focus:border-0 focus:outline-none focus:ring-amber-600 focus:outline-amber-500 hover:border-stone-400 border border-stone-300',
                            'block w-full rounded-md py-2 pl-3 pr-8  text-sm'
                        )} onChange={onChangeHandler} onBlur={onInputBlur} value={state.input.search} />
                    </div>
                </div>
            </form>
        </React.Fragment>
    )
}