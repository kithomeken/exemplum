import { Helmet } from "react-helmet"
import React, { useState } from "react"
import { useDispatch } from "react-redux"

import { ERR_404 } from "../errors/ERR_404"
import { ERR_500 } from "../errors/ERR_500"
import { Identity_00 } from "./Identity_00"
import { Identity_01 } from "./Identity_01"
import { IdentityContact } from "./IdentityContact"
import { Identity_03 } from "./Identity_03"
import { AUTH } from "../../api/API_Registry"
import { useAppSelector } from "../../store/hooks"
import { STORAGE_KEYS, STYLE } from "../../global/ConstantsRegistry"
import HttpServices from "../../services/HttpServices"
import { Loading } from "../../components/modules/Loading"
import { resetIdentity, setPRc0MetaStage } from "../../store/identityCheckActions"
import StorageServices from "../../services/StorageServices"

export const IdentityOnboarding = () => {
    const [state, setstate] = useState({
        httpStatus: 200,
        status: 'pending',
    })

    React.useEffect(() => {
        identityProcessStateCheck()
    }, [])

    const dispatch: any = useDispatch();
    const idC_State: any = useAppSelector(state => state.idC)
    const PRc1_ = StorageServices.getLocalStorage(STORAGE_KEYS.PRc0_OVERRIDE)

    const identityProcessStateCheck = async () => {
        let { status } = state
        let { httpStatus } = state
        dispatch(resetIdentity())

        try {
            const metaCheckResp: any = await HttpServices.httpGet(AUTH.META_CHECK)
            httpStatus = metaCheckResp.status

            if (metaCheckResp.data.success) {
                // Check if PRc1 is set else revert to PRc0
                let PRc0 = PRc1_ || metaCheckResp.data.payload.PRc0;

                const metaCheckProps = {
                    dataDump: {
                        PRc0: PRc0,
                    }
                }

                console.log('PRc0 | PRc1', PRc0);

                dispatch(setPRc0MetaStage(metaCheckProps))
                status = 'fulfilled'
            } else {
                status = 'rejected'
            }
        } catch (error) {
            console.error(error);
            status = 'rejected'
            httpStatus = 500
        }

        setstate({
            ...state, status, httpStatus
        })
    }

    const loadIdentityModules = (tab: string = 'in') => {
        switch (tab) {
            case "META_00":
                return <Identity_00 />

            case "META_01":
                return <Identity_01 />

            case "META_02":
                return <IdentityContact />

            case "META_03":
                return <Identity_03 />

            default:
                return <Identity_00 />
        }
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>Identity Onboarding</title>
            </Helmet>

            {
                state.status === 'rejected' ? (
                    <div className="py-3 px-4 w-full h-screen">
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
                    </div>
                ) : state.status === 'fulfilled' ? (
                    <>
                        {
                            loadIdentityModules(idC_State.PRc0)
                        }
                    </>
                ) : (
                    <div className="wrapper md:align-middle align-baseline w-full overflow-auto md:h-screen h-auto">
                        <section className="gx-container md:h-screen h-auto rounded-md w-full flex items-center justify-center" style={STYLE.MAX_WIDTH}>
                            <div className="flex md:flex-row flex-col align-middle items-center w-full md:pb-0 pb-10">
                                <div className="w-full h-1/2 flex flex-col justify-center">
                                    <div className="flex-grow pt-8">
                                        <Loading />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )
            }






        </React.Fragment >
    )
}