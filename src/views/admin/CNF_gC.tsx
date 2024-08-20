import React from "react"
import { useDispatch } from "react-redux"

import { ERR_500 } from "../errors/ERR_500"
import { ERR_404 } from "../errors/ERR_404"
import { useAppSelector } from "../../store/hooks"
import { Loading } from "../../components/modules/Loading"
import mainAsset from "../../assets/images/illustration_8351740.svg"
import { classNames, formatAmount } from "../../lib/modules/HelperFunctions"
import { APPLICATION, CONFIG_MAX_WIDTH } from "../../global/ConstantsRegistry"
import { overridePFg0MetaStage, setMpesaCredentials } from "../../store/identityCheckActions"
import { G_onInputChangeHandler, G_onInputBlurHandler } from "../../components/lib/InputHandlers"

export const CNF_gC = () => {
    const [state, setstate] = React.useState({
        httpStatus: 200,
        status: 'fulfilled',
        data: {

        },
        input: {
            trans_min: '0',
            trans_max: '0',
            pass_key: '',
            init_name: '',
            short_code: '',
            init_passwd: '',
            customer_key: '',
            customer_secret: '',
        },
        errors: {
            trans_min: '',
            trans_max: '',
            pass_key: '',
            init_name: '',
            short_code: '',
            init_passwd: '',
            customer_key: '',
            customer_secret: '',
        },
    })

    const dispatch: any = useDispatch();
    const idC_State: any = useAppSelector(state => state.idC)

    const onChangeHandler = (e: any) => {
        if (!idC_State.processing) {
            let output: any = G_onInputChangeHandler(e, idC_State.processing)
            let { input } = state
            let { errors }: any = state

            switch (e.target.name) {
                case 'identifier':
                    output.value = output.value.toUpperCase()
                    break;

                default:
                    break;
            }

            input[e.target.name] = output.value
            errors[e.target.name] = output.error

            setstate({
                ...state, input, errors
            })
        }
    }

    const targetLength = (name: string) => {
        switch (name) {
            case 'short_code':
                return {
                    min: 5,
                    max: 10
                };

            case 'trans_min':
            case 'trans_max':
                return {
                    min: 1,
                    max: 10
                };

            case 'pass_key':
                return {
                    min: 30,
                    max: 80
                };

            case 'customer_key':
            case 'customer_secret':
                return {
                    min: 10,
                    max: 80
                };

            default:
                return {
                    min: 5,
                    max: 30
                };
        }
    }

    const onInputBlur = (e: any) => {
        if (!idC_State.processing) {
            let { input } = state
            let { errors }: any = state

            const target0 = targetLength(e.target.name)
            let output: any = G_onInputBlurHandler(e, idC_State.processing, '', target0.min, target0.max)

            switch (e.target.name) {
                case 'short_code':
                    if (output.error.length < 1) {
                        const validShortCode = /^\d+$/.test(output.value);
                        output.error = validShortCode ? '' : 'Invalid short code format';
                    }
                    break

                case 'init_name':
                case 'init_passwd':
                    output.error = output.error.replace('Init', 'Initiator')
                    output.error = output.error.replace('passwd', 'password')
                    break

                case 'trans_max':
                case 'trans_min':
                    output.value = output.value.replace(',', '')
                    let targetTitle = e.target.name.charAt(0).toUpperCase() + e.target.name.slice(1)
                    targetTitle = targetTitle.replace('_', ' ')

                    const trans_min = input.trans_min.replace(',', '')
                    const trans_max = input.trans_max.replace(',', '')

                    if (output.value.length < 1) {
                        output.error = targetTitle + ' cannot be empty'
                    } else if (parseFloat(output.value) === 0) {
                        output.error = targetTitle + ' cannot be 0'
                    } else {
                        const validAmount = /^\d+(\.\d{1,2})?$/.test(output.value);

                        if (!validAmount) {
                            output.error = validAmount ? '' : 'Invalid amount format for ' + e.target.name
                        } else {
                            switch (e.target.name) {
                                case 'trans_min':
                                    output.error = (parseFloat(trans_max) > 0 && parseFloat(trans_max) < output.value)
                                        ? targetTitle + ' must be less than ' + trans_max
                                        : (errors.trans_max = '')
                                    break;

                                case 'trans_max':
                                    output.error = (output.value < parseFloat(trans_min))
                                        ? targetTitle + ' must be more than ' + trans_min
                                        : (errors.trans_min = '')
                                    break;

                                default:
                                    break;
                            }
                        }
                    }

                    output.value = formatAmount(parseInt(output.value))
                    output.error = output.error.replace('_', ' ')
                    output.error = output.error.replace('trans', 'transaction')
                    output.error = output.error.replace('Trans', 'Transaction')
                    break

                default:
                    break;
            }

            input[e.target.name] = output.value
            errors[e.target.name] = output.error

            setstate({
                ...state, input, errors
            })
        }
    }

    function comprehensiveValidation() {
        let valid = true
        let { input } = state
        let { errors } = state

        const inputArray = Object.keys(input)
        const errorArray = Object.keys(errors)

        inputArray.forEach((inputObject) => {
            const makeShiftEvent = {
                target: {
                    required: true,
                    name: inputObject,
                    value: String(input[inputObject]).trim(),
                }
            }

            const target0 = targetLength(inputObject)
            let output: any = G_onInputBlurHandler(makeShiftEvent, idC_State.processing, '', target0.min, target0.max)

            switch (inputObject) {
                case 'short_code':
                    if (output.error.length < 1) {
                        const validShortCode = /^\d+$/.test(output.value);
                        output.error = validShortCode ? '' : 'Invalid short code format';
                    }
                    break

                case 'init_name':
                case 'init_passwd':
                    output.error = output.error.replace('Init', 'Initiator')
                    output.error = output.error.replace('passwd', 'password')
                    break

                case 'trans_max':
                case 'trans_min':
                    output.value = output.value.replace(',', '')
                    let targetTitle = inputObject.charAt(0).toUpperCase() + inputObject.slice(1)
                    targetTitle = targetTitle.replace('_', ' ')

                    const trans_min = input.trans_min.replace(',', '')
                    const trans_max = input.trans_max.replace(',', '')

                    if (output.value.length < 1) {
                        output.error = targetTitle + ' cannot be empty'
                    } else if (parseFloat(output.value) === 0) {
                        output.error = targetTitle + ' cannot be 0'
                    } else {
                        const validAmount = /^\d+(\.\d{1,2})?$/.test(output.value);

                        if (!validAmount) {
                            output.error = validAmount ? '' : 'Invalid amount format for ' + inputObject
                        } else {
                            switch (inputObject) {
                                case 'trans_min':
                                    output.error = (parseFloat(trans_max) > 0 && parseFloat(trans_max) < output.value)
                                        ? targetTitle + ' must be less than ' + trans_max
                                        : (errors.trans_max = '')
                                    break;

                                case 'trans_max':
                                    output.error = (output.value < parseFloat(trans_min))
                                        ? targetTitle + ' must be more than ' + trans_min
                                        : (errors.trans_min = '')
                                    break;

                                default:
                                    break;
                            }
                        }
                    }

                    output.value = formatAmount(parseFloat(output.value))
                    output.error = output.error.replace('_', ' ')
                    output.error = output.error.replace('trans', 'transaction')
                    output.error = output.error.replace('Trans', 'Transaction')
                    break

                default:
                    break;
            }

            input[inputObject] = output.value
            errors[inputObject] = output.error

            setstate({
                ...state, input, errors
            })
        })

        errorArray.forEach((errorPnk) => {
            if (errors[errorPnk].length > 0) {
                valid = false
            }
        })

        return valid
    }

    const onFormSubmitHandler = (e: any) => {
        e.preventDefault()

        if (!idC_State.processing) {
            let validity = comprehensiveValidation()

            if (validity) {
                let { input } = state

                const credentialsProps = {
                    dataDump: {
                        trans_min: input.trans_min.replace(',', ''),
                        trans_max: input.trans_max.replace(',', ''),
                        pass_key: input.pass_key,
                        init_name: input.init_name,
                        short_code: input.short_code,
                        init_passwd: input.init_passwd,
                        customer_key: input.customer_key,
                        customer_secret: input.customer_secret,
                    }
                }

                dispatch(setMpesaCredentials(credentialsProps))
            }
        }
    }

    const overridePFg0 = (currentPFg0: any) => {
        if (!idC_State.processing) {
            dispatch(overridePFg0MetaStage(currentPFg0))
        }
    }

    // Simple example of obfuscating a string
    const obfuscate = (str) => {
        return str.split('').map(char => String.fromCharCode(char.charCodeAt(0) + 1)).join('');
    };

    const deobfuscate = (str) => {
        return str.split('').map(char => String.fromCharCode(char.charCodeAt(0) - 1)).join('');
    };

    const original = "SensitiveData";
    const obfuscated = obfuscate(original);
    const deobfuscated = deobfuscate(obfuscated);

    console.log('obfuscated', obfuscated); // Outputs obfuscated string
    console.log('deobfuscated', deobfuscated); // Outputs original "SensitiveData"


    return (
        <React.Fragment>
            {
                state.status === 'rejected' ? (
                    <div className="flex items-center justify-center">
                        {
                            state.httpStatus === 404 ? (
                                <ERR_404
                                    compact={true}
                                />
                            ) : (
                                <ERR_500 />
                            )
                        }
                    </div>
                ) : (
                    <div className="wrapper md:align-middle align-baseline w-full overflow-auto md:h-screen h-auto">
                        <section className={`gx-container md:h-screen rounded-md w-full flex ${state.status === 'pending' ? 'md:items-center' : null} justify-center`} style={CONFIG_MAX_WIDTH}>
                            <div className="flex md:flex-row flex-col align-middle md:items-center w-full md:pb-0 pb-10">
                                <div className="md:basis-3/5 md:px-6 px-6 w-full py-6 overflow-auto">
                                    {
                                        state.status === 'fulfilled' ? (
                                            <>
                                                <span className="text-2xl self-start text-orange-500 tracking-wider leading-7 block mb-3 md:pt-0 pt-4">{APPLICATION.NAME}</span>

                                                <div className="flex flex-row w-full align-middle justitfy-between items-center md:hidden">
                                                    <div className="w-48 pt-4 mx-auto pb-3">
                                                        <img src={mainAsset} alt={"hello_i'm_carol"} width="auto" className="block text-center m-auto" />
                                                    </div>
                                                </div>

                                                <div className="w-full text-sm text-stone-600 float-right mb-4">
                                                    <span className="text-base md:text-lg pt-4 text-stone-800 block">
                                                        <span className="w-full text-start text-base  md:gap-x-2 gap-y-1 align-middle">
                                                            <span className="text-orange-600 text-sm block">
                                                                Pre-flight Check #4:
                                                            </span>

                                                            Two more steps to go, let's add your <span className="text-green-600">MPESA</span> configurations
                                                        </span>
                                                    </span>
                                                </div>

                                                <form className="flex flex-col w-full gap-y-2" onSubmit={onFormSubmitHandler}>
                                                    <div className="w-full border-b-2 border-dashed">
                                                        <div className="w-full md:w-1/2 mb-3 pb-2">
                                                            <div className="relative mt-2 rounded shadow-sm">
                                                                <input type="text" name="short_code" id="short_code" placeholder="Short Code" autoComplete="off"
                                                                    className={classNames(
                                                                        state.errors.short_code.length > 0 ?
                                                                            'text-red-900 ring-slate-300 placeholder:text-red-400 focus:ring-red-600 border border-red-600 focus:outline-red-500' :
                                                                            'text-stone-900 ring-slate-300 placeholder:text-stone-400 focus:border-0 focus:outline-none focus:ring-orange-600 focus:outline-orange-500 hover:border-stone-400 border border-stone-300',
                                                                        'block w-full rounded-md py-1.5 pl-3 pr-8  text-sm'
                                                                    )} onChange={onChangeHandler} value={state.input.short_code} onBlur={onInputBlur} />
                                                                <div className="absolute inset-y-0 right-0 flex items-center w-8">
                                                                    {
                                                                        state.errors.short_code.length > 0 ? (
                                                                            <span className="fa-duotone text-red-500 fa-circle-exclamation fa-lg"></span>
                                                                        ) : null
                                                                    }
                                                                </div>
                                                            </div>

                                                            {
                                                                state.errors.short_code.length > 0 ? (
                                                                    <span className='invalid-feedback text-xs text-red-600 pl-0'>
                                                                        {state.errors.short_code}
                                                                    </span>
                                                                ) : null
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className="w-full pt-2 flex md:flex-row flex-col gap-x-4 pb-2">
                                                        <div className="w-full md:w-1/2 mb-3">
                                                            <div className="relative mt-2 rounded shadow-sm">
                                                                <input type="text" name="customer_key" id="customer_key" placeholder="Customer Key" autoComplete="off"
                                                                    className={classNames(
                                                                        state.errors.customer_key.length > 0 ?
                                                                            'text-red-900 ring-slate-300 placeholder:text-red-400 focus:ring-red-600 border border-red-600 focus:outline-red-500' :
                                                                            'text-stone-900 ring-slate-300 placeholder:text-stone-400 focus:border-0 focus:outline-none focus:ring-orange-600 focus:outline-orange-500 hover:border-stone-400 border border-stone-300',
                                                                        'block w-full rounded-md py-1.5 pl-3 pr-8  text-sm'
                                                                    )} onChange={onChangeHandler} value={state.input.customer_key} onBlur={onInputBlur} />
                                                                <div className="absolute inset-y-0 right-0 flex items-center w-8">
                                                                    {
                                                                        state.errors.customer_key.length > 0 ? (
                                                                            <span className="fa-duotone text-red-500 fa-circle-exclamation fa-lg"></span>
                                                                        ) : null
                                                                    }
                                                                </div>
                                                            </div>

                                                            {
                                                                state.errors.customer_key.length > 0 ? (
                                                                    <span className='invalid-feedback text-xs text-red-600 pl-0'>
                                                                        {state.errors.customer_key}
                                                                    </span>
                                                                ) : null
                                                            }
                                                        </div>

                                                        <div className="w-full md:w-1/2 md:mb-3 mb-2">
                                                            <div className="relative mt-2 rounded shadow-sm">
                                                                <input type="text" name="customer_secret" id="customer_secret" placeholder="Customer Secret" autoComplete="off"
                                                                    className={classNames(
                                                                        state.errors.customer_secret.length > 0 ?
                                                                            'text-red-900 ring-slate-300 placeholder:text-red-400 focus:ring-red-600 border border-red-600 focus:outline-red-500' :
                                                                            'text-stone-900 ring-slate-300 placeholder:text-stone-400 focus:border-0 focus:outline-none focus:ring-orange-600 focus:outline-orange-500 hover:border-stone-400 border border-stone-300',
                                                                        'block w-full rounded-md py-1.5 pl-3 pr-8  text-sm'
                                                                    )} onChange={onChangeHandler} value={state.input.customer_secret} onBlur={onInputBlur} />
                                                                <div className="absolute inset-y-0 right-0 flex items-center w-8">
                                                                    {
                                                                        state.errors.customer_secret.length > 0 ? (
                                                                            <span className="fa-duotone text-red-500 fa-circle-exclamation fa-lg"></span>
                                                                        ) : null
                                                                    }
                                                                </div>
                                                            </div>

                                                            {
                                                                state.errors.customer_secret.length > 0 ? (
                                                                    <span className='invalid-feedback text-xs text-red-600 pl-0'>
                                                                        {state.errors.customer_secret}
                                                                    </span>
                                                                ) : null
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className="w-full md:mb-3">
                                                        <div className="relative md:mt-2 rounded shadow-sm">
                                                            <input type="text" name="pass_key" id="pass_key" placeholder="Pass Key" autoComplete="off"
                                                                className={classNames(
                                                                    state.errors.pass_key.length > 0 ?
                                                                        'text-red-900 ring-slate-300 placeholder:text-red-400 focus:ring-red-600 border border-red-600 focus:outline-red-500' :
                                                                        'text-stone-900 ring-slate-300 placeholder:text-stone-400 focus:border-0 focus:outline-none focus:ring-orange-600 focus:outline-orange-500 hover:border-stone-400 border border-stone-300',
                                                                    'block w-full rounded-md py-1.5 pl-3 pr-8  text-sm'
                                                                )} onChange={onChangeHandler} value={state.input.pass_key} onBlur={onInputBlur} />
                                                            <div className="absolute inset-y-0 right-0 flex items-center w-8">
                                                                {
                                                                    state.errors.pass_key.length > 0 ? (
                                                                        <span className="fa-duotone text-red-500 fa-circle-exclamation fa-lg"></span>
                                                                    ) : null
                                                                }
                                                            </div>
                                                        </div>

                                                        {
                                                            state.errors.pass_key.length > 0 ? (
                                                                <span className='invalid-feedback text-xs text-red-600 pl-0'>
                                                                    {state.errors.pass_key}
                                                                </span>
                                                            ) : null
                                                        }
                                                    </div>

                                                    <div className="w-full pt-2 flex md:flex-row flex-col gap-x-4 pb-2 border-b-2 border-dashed">
                                                        <div className="w-full md:w-1/2 mb-3">
                                                            <div className="relative mt-2 rounded shadow-sm">
                                                                <input type="text" name="init_name" id="init_name" placeholder="Initiator Name" autoComplete="off"
                                                                    className={classNames(
                                                                        state.errors.init_name.length > 0 ?
                                                                            'text-red-900 ring-slate-300 placeholder:text-red-400 focus:ring-red-600 border border-red-600 focus:outline-red-500' :
                                                                            'text-stone-900 ring-slate-300 placeholder:text-stone-400 focus:border-0 focus:outline-none focus:ring-orange-600 focus:outline-orange-500 hover:border-stone-400 border border-stone-300',
                                                                        'block w-full rounded-md py-1.5 pl-3 pr-8  text-sm'
                                                                    )} onChange={onChangeHandler} value={state.input.init_name} onBlur={onInputBlur} />
                                                                <div className="absolute inset-y-0 right-0 flex items-center w-8">
                                                                    {
                                                                        state.errors.init_name.length > 0 ? (
                                                                            <span className="fa-duotone text-red-500 fa-circle-exclamation fa-lg"></span>
                                                                        ) : null
                                                                    }
                                                                </div>
                                                            </div>

                                                            {
                                                                state.errors.init_name.length > 0 ? (
                                                                    <span className='invalid-feedback text-xs text-red-600 pl-0'>
                                                                        {state.errors.init_name}
                                                                    </span>
                                                                ) : null
                                                            }
                                                        </div>

                                                        <div className="w-full md:w-1/2 mb-3">
                                                            <div className="relative mt-2 rounded shadow-sm">
                                                                <input type="password" name="init_passwd" id="init_passwd" placeholder="Initiator Password" autoComplete="off"
                                                                    className={classNames(
                                                                        state.errors.init_passwd.length > 0 ?
                                                                            'text-red-900 ring-slate-300 placeholder:text-red-400 focus:ring-red-600 border border-red-600 focus:outline-red-500' :
                                                                            'text-stone-900 ring-slate-300 placeholder:text-stone-400 focus:border-0 focus:outline-none focus:ring-orange-600 focus:outline-orange-500 hover:border-stone-400 border border-stone-300',
                                                                        'block w-full rounded-md py-1.5 pl-3 pr-8  text-sm'
                                                                    )} onChange={onChangeHandler} value={state.input.init_passwd} onBlur={onInputBlur} />
                                                                <div className="absolute inset-y-0 right-0 flex items-center w-8">
                                                                    {
                                                                        state.errors.init_passwd.length > 0 ? (
                                                                            <span className="fa-duotone text-red-500 fa-circle-exclamation fa-lg"></span>
                                                                        ) : null
                                                                    }
                                                                </div>
                                                            </div>

                                                            {
                                                                state.errors.init_passwd.length > 0 ? (
                                                                    <span className='invalid-feedback text-xs text-red-600 pl-0'>
                                                                        {state.errors.init_passwd}
                                                                    </span>
                                                                ) : null
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className="w-full pt-2 flex md:flex-row flex-col gap-x-4">
                                                        <span className="md:basis-2/5 text-stone-700 text-sm py-2">
                                                            Min & max transactions limits for both withdrawals and contributions:
                                                        </span>

                                                        <div className="flex flex-row gap-x-3 align-middle items-center md:basis-3/5">
                                                            <div className="w-1/2 mb-3">
                                                                <div className="relative mt-2 rounded shadow-sm">
                                                                    <input type="text" name="trans_min" id="trans_min" placeholder="Min" autoComplete="off"
                                                                        className={classNames(
                                                                            state.errors.trans_min.length > 0 ?
                                                                                'text-red-900 ring-slate-300 placeholder:text-red-400 focus:ring-red-600 border border-red-600 focus:outline-red-500' :
                                                                                'text-stone-900 ring-slate-300 placeholder:text-stone-400 focus:border-0 focus:outline-none focus:ring-orange-600 focus:outline-orange-500 hover:border-stone-400 border border-stone-300',
                                                                            'block w-full rounded-md py-1.5 pl-3 pr-8  text-sm'
                                                                        )} onChange={onChangeHandler} value={parseFloat(state.input.trans_min) === 0 ? '' : state.input.trans_min} onBlur={onInputBlur} />
                                                                    <div className="absolute inset-y-0 right-0 flex items-center w-8">
                                                                        {
                                                                            state.errors.trans_min.length > 0 ? (
                                                                                <span className="fa-duotone text-red-500 fa-circle-exclamation fa-lg"></span>
                                                                            ) : null
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <span className="text-stone-700 block">-</span>

                                                            <div className="w-1/2 mb-3">
                                                                <div className="relative mt-2 rounded shadow-sm">
                                                                    <input type="text" name="trans_max" id="trans_max" placeholder="Max" autoComplete="off"
                                                                        className={classNames(
                                                                            state.errors.trans_max.length > 0 ?
                                                                                'text-red-900 ring-slate-300 placeholder:text-red-400 focus:ring-red-600 border border-red-600 focus:outline-red-500' :
                                                                                'text-stone-900 ring-slate-300 placeholder:text-stone-400 focus:border-0 focus:outline-none focus:ring-orange-600 focus:outline-orange-500 hover:border-stone-400 border border-stone-300',
                                                                            'block w-full rounded-md py-1.5 pl-3 pr-8  text-sm'
                                                                        )} onChange={onChangeHandler} value={parseFloat(state.input.trans_max) === 0 ? '' : state.input.trans_max} onBlur={onInputBlur} />
                                                                    <div className="absolute inset-y-0 right-0 flex items-center w-8">
                                                                        {
                                                                            state.errors.trans_max.length > 0 ? (
                                                                                <span className="fa-duotone text-red-500 fa-circle-exclamation fa-lg"></span>
                                                                            ) : null
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {
                                                        state.errors.trans_min.length > 0 ? (
                                                            <span className='invalid-feedback block text-xs text-red-600 pl-0'>
                                                                {state.errors.trans_min}
                                                            </span>
                                                        ) : null
                                                    }

                                                    {
                                                        state.errors.trans_max.length > 0 ? (
                                                            <span className='invalid-feedback block text-xs text-red-600 pl-0'>
                                                                {state.errors.trans_max}
                                                            </span>
                                                        ) : null
                                                    }

                                                    <div className="mb-3 pt-3 px-0 w-full flex flex-row align-middle items-center gap-x-3">
                                                        <div className="flex-1 w-1/2">
                                                            <button onClick={() => overridePFg0(idC_State.PFg0)} className="text-orange-600 relative w-28 py-1.5 px-4 border border-transparent text-sm rounded-md bg-inherit hover:text-orange-700 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:text-orange-700" type="button" disabled={idC_State.processing ? true : false}>
                                                                <div className="flex justify-center align-middle items-center gap-x-3">
                                                                    <i className="fa-duotone fa-arrow-left fa-lg"></i>
                                                                    Previous
                                                                </div>
                                                            </button>
                                                        </div>

                                                        <div className="flex-1 w-1/2">
                                                            <button className="bg-orange-600 float-right relative w-28 py-1.5 px-4 border border-transparent text-sm rounded-md text-white hover:bg-orange-700 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:bg-orange-700" type="submit">
                                                                {
                                                                    idC_State.processing ? (
                                                                        <i className="fad fa-spinner-third fa-xl fa-spin py-2.5"></i>
                                                                    ) : (
                                                                        <div className="flex justify-center align-middle items-center gap-x-3">
                                                                            Next
                                                                            <i className="fa-duotone fa-arrow-right fa-lg"></i>
                                                                        </div>
                                                                    )
                                                                }
                                                            </button>
                                                        </div>
                                                    </div>

                                                </form>

                                                <div className="mx-auto py-3 text-center block w-full">
                                                    <p className="text-sm text-stone-500">
                                                        © {new Date().getFullYear()}. Elevated Acts of Appreciation, <span className="text-orange-600 block">Tip by Tip.</span>
                                                    </p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <Loading />
                                            </>
                                        )
                                    }
                                </div>

                                <div className="md:basis-2/5 hidden md:block h-screen px-4 py-6">
                                    <img className="h-full rounded-2xl" src={mainAsset} alt={"data_points"} loading="lazy" />
                                </div>
                            </div>
                        </section>
                    </div >
                )
            }
        </React.Fragment >
    )
}