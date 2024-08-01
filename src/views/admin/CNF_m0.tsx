import React from "react"
import { resetCNF_g, setPFg0MetaStage } from "../../store/identityCheckActions";
import { CNF_gA } from "./CNF_gA";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { PREFLIGHT } from "../../api/API_Registry";
import { Loading } from "../../components/modules/Loading";
import { STYLE } from "../../global/ConstantsRegistry";
import HttpServices from "../../services/HttpServices";
import { useAppSelector } from "../../store/hooks";
import { ERR_404 } from "../errors/ERR_404";
import { ERR_500 } from "../errors/ERR_500";
import { CNF_gB } from "./CNF_gB";

export const CNF_m0 = () => {
    const [state, setstate] = React.useState({
        httpStatus: 200,
        status: 'pending',
    })

    React.useEffect(() => {
        preflightProgressCheck()
    }, [])

    const dispatch: any = useDispatch();
    const idC_State: any = useAppSelector(state => state.idC)

    const preflightProgressCheck = async () => {
        let { status } = state
        let { httpStatus } = state
        dispatch(resetCNF_g())

        try {
            const progCheckResp: any = await HttpServices.httpGet(PREFLIGHT.INSPECTION_CHECK)
            httpStatus = progCheckResp.status

            if (progCheckResp.data.success) {
                const PFg0 = progCheckResp.data.payload.PFg0

                const metaProps = {
                    dataDump: {
                        PFg0: PFg0
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

        setstate({
            ...state, status, httpStatus
        })
    }

    const loadCNF_Modules = (tab: string = 'in') => {
        switch (tab) {
            case "CNF_gA":
                return <CNF_gA />

            case "CNF_gB":
                return <CNF_gB />

            default:
                return
        }
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>Configurations</title>
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
                            loadCNF_Modules(idC_State.PFg0)
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
        </React.Fragment>
    )
}