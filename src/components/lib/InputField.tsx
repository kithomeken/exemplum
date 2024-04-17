import React, { FC } from "react";
import { classNames } from "../../lib/modules/HelperFunctions";

interface Props {
    state: any,
    type?: any,
    name: string,
    label: string,
    required?: boolean,
    onChangeHandler: any,
    onInputBlurHandler: any,
}

export const InputField: FC<Props> = ({ name, label, type = 'text', state, onChangeHandler, onInputBlurHandler }) => {
    const { input } = state
    const { errors } = state
    const preFlight: any = state[name]    

    return (
        <React.Fragment>
            <div className="w-12/12 rounded shadow-none space-y-px mb-4">
                <label htmlFor={name} className="block text-sm font-normal leading-6 text-gray-600 mb-2">{label}:</label>

                <div className="relative mt-2 rounded shadow-sm">
                    <input type={type} name={name} id={name} placeholder={label} autoComplete="off"
                        className={classNames(
                            errors[name].length > 0 ?
                                'text-red-900 ring-slate-300 placeholder:text-red-400 focus:ring-red-600 border border-red-600 focus:outline-red-500' :
                                'text-gray-900 ring-slate-300 placeholder:text-gray-400 focus:border-0 focus:outline-none focus:ring-green-600 focus:outline-green-500 hover:border-gray-400',
                            'block w-full rounded py-2 pl-3 pr-8 border border-gray-300 text-sm'
                        )} onChange={onChangeHandler} value={input[name]} onBlur={onInputBlurHandler} required />
                    <div className="absolute inset-y-0 right-0 flex items-center w-8">
                        {
                            preFlight.checking ? (
                                <span className="fa-duotone text-green-500 fa-spinner-third fa-lg fa-spin"></span>
                            ) : errors[name].length > 0 ? (
                                <span className="fa-duotone text-red-500 fa-circle-exclamation fa-lg"></span>
                            ) : null
                        }
                    </div>
                </div>

                {
                    errors[name].length > 0 ? (
                        <span className='invalid-feedback text-xs text-red-600 pl-0'>
                            {errors[name]}
                        </span>
                    ) : null
                }
            </div>
        </React.Fragment>
    )
}


export const TextAreaField: FC<Props> = ({ name, label, state, required = false, onChangeHandler, onInputBlurHandler }) => {
    const { input } = state
    const { errors } = state

    return (
        <React.Fragment>
            <div className="w-12/12 rounded shadow-none space-y-px mb-4">
                <label htmlFor={name} className="block text-sm font-normal leading-6 text-gray-600 mb-2">{label}:</label>

                <div className="relative mt-2 rounded shadow-sm">
                    <textarea name={name} id={name} placeholder={label} autoComplete="off" rows={3}
                        className={classNames(
                            errors[name].length > 0 ?
                                'text-red-900 ring-slate-300 placeholder:text-red-400 focus:ring-red-600 border border-red-600 focus:outline-red-500' :
                                'text-gray-900 ring-slate-300 placeholder:text-gray-400 focus:outline-none focus:border-0 focus:ring-green-600 focus:outline-green-500 hover:border-gray-400',
                            'block w-full rounded py-2 resize-none pl-3 pr-8 border border-gray-300 text-sm'
                        )} onChange={onChangeHandler} onBlur={onInputBlurHandler} required={required} value={input[name]}></textarea>
                    <div className="absolute inset-y-0 right-0 top-0 pt-4 flex items-enter w-8">
                        {
                            errors[name].length > 0 ? (
                                <span className="fa-duotone text-red-500 fa-circle-exclamation fa-lg"></span>
                            ) : null
                        }
                    </div>
                </div>

                {
                    errors[name].length > 0 ? (
                        <span className='invalid-feedback text-xs text-red-600 pl-0'>
                            {errors[name]}
                        </span>
                    ) : null
                }
            </div>
        </React.Fragment>
    )
}