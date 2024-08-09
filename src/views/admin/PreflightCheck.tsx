import React, { useState } from "react"
import { useDispatch } from "react-redux";
import { PREFLIGHT_, STORAGE_KEYS } from "../../global/ConstantsRegistry";
import StorageServices from "../../services/StorageServices";
import HttpServices from "../../services/HttpServices";
import { Helmet } from "react-helmet";
import { Loading } from "../../components/modules/Loading";
import { ERR_404 } from "../errors/ERR_404";
import { ERR_500 } from "../errors/ERR_500";
import { setPFg0MetaStage } from "../../store/identityCheckActions";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../../firebase/firebaseConfigs";
import { AdminstrativeHome } from "./AdministrativeHome";
import { PREFLIGHT } from "../../api/API_Registry";
import { commonRoutes } from "../../routes/routes";
import { Navigate } from "react-router-dom";

export const PreflightCheck = () => {
    const [state, setstate] = useState({
        httpStatus: 200,
        status: 'pending',
        data: {
            PFg0: null
        }
    })

    const dispatch: any = useDispatch();
    const [verified, setVerified] = useState('0')

    const CNF_g_Route: any = (
        commonRoutes.find(
            (routeName) => routeName.name === 'CNF_m0_')
    )?.path

    React.useEffect(() => {
        preflightProgressCheck()
    }, [])

    const preflightProgressCheck = async () => {
        let { data } = state
        let { status } = state
        let { httpStatus } = state
        const PFg0State = StorageServices.getLocalStorage(STORAGE_KEYS.PFg0_STATE)

        if (PFg0State === null) {
            try {
                const progCheckResp: any = await HttpServices.httpGet(PREFLIGHT.INSPECTION_CHECK)
                httpStatus = progCheckResp.status

                if (progCheckResp.data.success) {
                    data.PFg0 = progCheckResp.data.payload.PFg0

                    const metaProps = {
                        dataDump: {
                            PFg0: data.PFg0
                        }
                    }

                    dispatch(setPFg0MetaStage(metaProps))
                    status = 'fulfilled'
                } else {
                    status = 'rejected'
                }
            } catch (error) {
                console.error(error);
                status = 'rejected'
                httpStatus = 500
            }
        } else {
            data.PFg0 = PFg0State

            if (data.PFg0 === '') {

                return
            }

            status = 'fulfilled'
        }

        setstate({
            ...state, status, data, httpStatus
        })
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>Home</title>
            </Helmet>

            {
                state.status === 'rejected' ? (
                    <div className="py-3 px-4">
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
                            state.data.PFg0 === 'CNF_g0' ? (
                                /* 
                                     * Pre-flights configs are completed
                                     * Proceed to administration home page
                                    */
                                <AdminstrativeHome />
                            ) : (
                                /* 
                                 * Pre-flight has not been completed. 
                                 * Complete pre-flight first before any other action
                                 */
                                <Navigate to={CNF_g_Route} replace />
                            )
                        }
                    </>
                ) : (
                    <div className="wrapper md:align-middle align-baseline w-full overflow-auto md:h-screen h-auto">
                        <section className="gx-container md:h-screen h-auto rounded-md w-full flex items-center justify-center">
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
        </React.Fragment>
    )
}