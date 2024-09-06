import React from "react"

import { ACCOUNT } from "../../api/API_Registry"
import { AccordionEntity } from "./AccordionEntity"
import { AccordionPersona } from "./AccordionPersona"
import HttpServices from "../../services/HttpServices"
import { Loading } from "../../components/modules/Loading"
import { classNames } from "../../lib/modules/HelperFunctions"
import completed from "../../assets/images/illustration_050914148.svg"
import { APPLICATION, CONFIG_MAX_WIDTH } from "../../global/ConstantsRegistry"

export const Identity_04 = () => {
    const [state, setstate] = React.useState({
        httpStatus: 200,
        status: 'pending',
        data: {
            entity: null,
            identity: null,
            attachment: null,
        }
    })

    const [activeElement, setActiveElement] = React.useState("");

    const handleClick = (value: string) => {
        if (value === activeElement) {
            setActiveElement("");
        } else {
            setActiveElement(value);
        }
    }

    React.useEffect(() => {
        accountProfile()
    }, [])

    const accountProfile = async () => {
        let { data } = state
        let { status } = state

        try {
            const response: any = await HttpServices.httpGet(ACCOUNT.PROFILE)

            if (response.data.success) {
                status = 'fulfilled'
                data.entity = response.data.payload.entity
                data.identity = response.data.payload.identity
                data.attachment = response.data.payload.attachment
            } else {
                status = 'rejected'
            }
        } catch (error) {
            status = 'fulfilled'
            console.log(error);
        }

        setstate({
            ...state, data, status
        })
    }

    return (
        <React.Fragment>
            <div className="wrapper md:align-middle align-baseline w-full overflow-auto md:h-screen h-auto">
                <section className="gx-container md:h-screen rounded-md w-full flex md:items-center justify-center" style={CONFIG_MAX_WIDTH}>
                    <div className="flex md:flex-row flex-col align-middle items-center w-full md:pb-0 pb-10">
                        <div className="md:basis-3/5 md:px-6 px-4 w-full py-6 overflow-auto">
                            {
                                state.status === 'rejected' ? (
                                    <>

                                    </>
                                ) : state.status === 'fulfilled' ? (
                                    <>
                                        <span className="text-2xl self-start text-orange-500 tracking-wider leading-7 block mb-2 md:pt-0 pt-4">{APPLICATION.NAME}</span>

                                        <div className="flex flex-row w-full align-middle justitfy-between items-center md:hidden">
                                            <div className="w-48 pt-4 mx-auto pb-3">
                                                <img src={completed} alt={"review_and_confirm"} width="auto" className="block text-center m-auto" />
                                            </div>
                                        </div>

                                        <span className="text-base text-stone-700 md:text-start text-center block pb-4">
                                            Let's review and confirm you details
                                        </span>

                                        <div id="accordionExample">
                                            <div className="rounded-t-lg border-0 border-neutral-200 bg-white">
                                                <h2 className="mb-0" id="personaHeading">
                                                    <button
                                                        className={
                                                            classNames(
                                                                activeElement === "persona" ? `text-orange-600 border-b-0` : 'text-stone-600',
                                                                'group relative flex w-full items-center rounded-t-[15px] border-0 bg-white px-5 py-4 text-left text-base transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none font-medium'
                                                            )
                                                        }
                                                        type="button"
                                                        onClick={() => handleClick("persona")}
                                                        aria-expanded="true"
                                                        aria-controls="collapseOne"
                                                    >
                                                        Personal Details
                                                        <span
                                                            className={`${activeElement === "persona"
                                                                ? `rotate-[-180deg] -mr-1`
                                                                : `rotate-0 fill-[#212529]  dark:fill-white`
                                                                } ml-auto h-5 w-5 shrink-0 fill-[#336dec] transition-transform duration-200 ease-in-out motion-reduce:transition-none dark:fill-blue-300`}
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth="1.5"
                                                                stroke="currentColor"
                                                                className="h-6 w-6"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                                                />
                                                            </svg>
                                                        </span>
                                                    </button>
                                                </h2>
                                                <AccordionPersona
                                                    activeElement={activeElement}
                                                    persona={state.data.identity}
                                                    attachment={state.data.attachment}
                                                />
                                            </div>
                                        </div>
                                        <div className="rounded-b-lg border-0 border-t border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800">
                                            <h2 className="accordion-header mb-0" id="entityHeading">
                                                <button
                                                    className={
                                                        classNames(
                                                            activeElement === "entity" ? `text-orange-600 border-b-0` : 'text-stone-600',
                                                            'group relative flex w-full items-center rounded-t-[15px] border-0 bg-white px-5 py-4 text-left text-base transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none font-medium'
                                                        )
                                                    }
                                                    type="button"
                                                    onClick={() => handleClick("entity")}
                                                    aria-expanded="true"
                                                    aria-controls="collapseOne"
                                                >
                                                    Entity Details
                                                    <span
                                                        className={`${activeElement === "entity"
                                                            ? `rotate-[-180deg] -mr-1`
                                                            : `rotate-0 fill-[#212529] dark:fill-white`
                                                            } ml-auto h-5 w-5 shrink-0 fill-[#336dec] transition-transform duration-200 ease-in-out motion-reduce:transition-none dark:fill-blue-300`}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth="1.5"
                                                            stroke="currentColor"
                                                            className="h-6 w-6"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                                            />
                                                        </svg>
                                                    </span>
                                                </button>
                                            </h2>
                                            <AccordionEntity
                                                    entity={state.data.entity}
                                                    activeElement={activeElement}
                                                />
                                        </div>
                                    </>
                                ) : (
                                    <div className="py-4">
                                        <Loading />
                                    </div>
                                )
                            }
                        </div>

                        <div className="md:basis-2/5 hidden md:block h-screen px-4 py-6">
                            <img className="h-full rounded-2xl" src={completed} alt={"pana_calling"} loading="lazy" />
                        </div>
                    </div>
                </section>
            </div >
        </React.Fragment >
    )
}