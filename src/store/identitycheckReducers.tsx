import StorageServices from "../services/StorageServices";
import { encryptAndStoreLS } from "../lib/modules/HelperFunctions";
import { IDENTITY_, PREFLIGHT_, STORAGE_KEYS } from "../global/ConstantsRegistry";

const identityState = {
    error: null,
    PFg0: 'CNF_gQ',
    PRc0: 'META_gS',
    processing: false,
}

export const identityCheckReducer = (state = identityState, action: any) => {
    const metaPRc0State = StorageServices.getLocalStorage(STORAGE_KEYS.PRc0_STATE)
    const metaPFg0State = StorageServices.getLocalStorage(STORAGE_KEYS.PFg0_STATE)
    let metaErrMsg = null

    switch (action.type) {
        case IDENTITY_.PRc0:
            const metaPRc0 = action.response.dataDump.PRc0
            StorageServices.setLocalStorage(STORAGE_KEYS.PRc0_STATE, metaPRc0)

            return {
                ...state,
                PRc0: metaPRc0,
                PFg0: metaPFg0State,
            }

        case IDENTITY_.RESET_:
            return {
                ...state,
                error: null,
                processing: false,
                PRc0: metaPRc0State,
                PFg0: metaPFg0State,
            }

        case IDENTITY_.PROCESSING:
            return {
                ...state,
                error: null,
                processing: true,
                PRc0: metaPRc0State,
                PFg0: metaPFg0State,
            }

        case IDENTITY_.PRc0_UPDATE:
            const PRc0Code = metaPRc0State.charAt(metaPRc0State.length - 1);
            const nextPRc0 = 'META_0' + (parseInt(PRc0Code) + 1)

            StorageServices.setLocalStorage(STORAGE_KEYS.PRc0_STATE, nextPRc0)
            StorageServices.setLocalStorage(STORAGE_KEYS.PRc0_OVERRIDE, nextPRc0)

            return {
                ...state,
                error: null,
                PRc0: nextPRc0,
                processing: false,
                PFg0: metaPFg0State,
            }

        case IDENTITY_.PRc0_OVRD:
            let overrideDump = action.response.dataDump
            let PRc1_ = overrideDump.stage
            let metaData = overrideDump.data

            encryptAndStoreLS(STORAGE_KEYS.PRc0_DATA, metaData)
            StorageServices.setLocalStorage(STORAGE_KEYS.PRc0_STATE, PRc1_)
            StorageServices.setLocalStorage(STORAGE_KEYS.PRc0_OVERRIDE, PRc1_)
            
            return {
                ...state,
                error: null,
                PRc0: PRc1_,
                processing: false,
                PFg0: metaPFg0State,
            }

        case IDENTITY_.PRc0_OVRD_END:
            let correctStage = 'META_00'
            StorageServices.setLocalStorage(STORAGE_KEYS.PRc0_STATE, correctStage)
            StorageServices.removeLocalStorage(STORAGE_KEYS.PRc0_OVERRIDE)

            return {
                ...state,
                error: null,
                processing: false,
                PRc0: correctStage,
                PFg0: metaPFg0State,
            }

        case IDENTITY_.PRc0_EXCEPTION:
            metaErrMsg = action.response
            console.log('PRc0_EXCEPTION: ', metaPRc0State);

            return {
                ...state,
                processing: false,
                error: metaErrMsg,
                PRc0: metaPRc0State,
                PFg0: metaPFg0State,
            }

        case IDENTITY_.PRc0_COMPLETED:
            const metaPRc0_Complete = action.response.PRc0
            console.log('COMP', metaPRc0_Complete);

            StorageServices.setLocalStorage(STORAGE_KEYS.PRc0_STATE, metaPRc0_Complete)

            return {
                ...state,
                error: null,
                processing: false,
                PFg0: metaPFg0State,
                PRc0: metaPRc0_Complete,
            }

        case PREFLIGHT_.PFg0:
            const metaPFg0 = action.response.dataDump.PFg0
            StorageServices.setLocalStorage(STORAGE_KEYS.PFg0_STATE, metaPFg0)
            StorageServices.setLocalStorage(STORAGE_KEYS.PFg0_OVERRIDE, metaPFg0)

            return {
                ...state,
                PFg0: metaPFg0,
                PRc0: metaPRc0State,
            }

        case PREFLIGHT_.RESET_:
            return {
                ...state,
                error: null,
                processing: false,
                PFg0: metaPFg0State,
                PRc0: metaPRc0State,
            }

        case PREFLIGHT_.PROCESSING:
            return {
                ...state,
                error: null,
                processing: true,
                PFg0: metaPFg0State,
                PRc0: metaPRc0State,
            }

        case PREFLIGHT_.PFg0_UPDATE:
            const PFg0Code = metaPFg0State.charAt(metaPFg0State.length - 1);
            const nextChar = String.fromCharCode(PFg0Code.charCodeAt(0) + 1);

            const nextPFg0 = 'CNF_g' + nextChar
            StorageServices.setLocalStorage(STORAGE_KEYS.PFg0_STATE, nextPFg0)
            StorageServices.setLocalStorage(STORAGE_KEYS.PFg0_OVERRIDE, nextPFg0)

            return {
                ...state,
                error: null,
                PFg0: nextPFg0,
                processing: false,
                PRc0: metaPRc0State,
            }

        case PREFLIGHT_.PFg0_OVRD:
            const currPFg0 = metaPFg0State.charAt(metaPFg0State.length - 1);
            const prevChar = String.fromCharCode(currPFg0.charCodeAt(0) - 1);

            // PFg0 state check for MPESA credentials
            const shuPFg0 = 'CNF_g' + prevChar
            const PFg0_CHK = shuPFg0 === 'CNF_gC' ? 'CNF_gD' : shuPFg0

            StorageServices.setLocalStorage(STORAGE_KEYS.PFg0_STATE, PFg0_CHK)
            StorageServices.setLocalStorage(STORAGE_KEYS.PFg0_OVERRIDE, PFg0_CHK)

            return {
                ...state,
                error: null,
                PFg0: PFg0_CHK,
                processing: false,
                PRc0: metaPRc0State,
            }

        case PREFLIGHT_.PFg0_FIN:
            const PFg0_FIN = 'CNF_g0'
            StorageServices.setLocalStorage(STORAGE_KEYS.PFg0_STATE, PFg0_FIN)

            return {
                ...state,
                error: null,
                PFg0: PFg0_FIN,
                processing: false,
                PRc0: metaPRc0State,
            }

        case PREFLIGHT_.PFg0_EXCEPTION:
            metaErrMsg = action.response
            console.log('PFg0_EXCEPTION: ', metaErrMsg);
            console.log('PFg0_EXCEPTION: ', metaPFg0State);

            return {
                ...state,
                processing: false,
                error: metaErrMsg,
                PFg0: metaPFg0State,
                PRc0: metaPRc0State,
            }

        default:
            return state;
    }
}