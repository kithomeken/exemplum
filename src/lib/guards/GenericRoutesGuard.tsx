import React from "react"
import { Outlet } from "react-router"

const GenericRoutesGuard = () => {
    return (
        <React.Fragment>

            <Outlet />

        </React.Fragment>
    )
}

export default GenericRoutesGuard;