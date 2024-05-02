import React, { FC } from "react"

import { Basic_Modal_Props } from "../../lib/modules/Interfaces"
import { InformationalModal } from "../../lib/hooks/InformationalModal"

export const PasswordPolicy: FC<Basic_Modal_Props> = ({ show, showOrHide }) => {

    return (
        <React.Fragment>
            <InformationalModal
                size={"lg"}
                show={show}
                showOrHide={showOrHide}
                title={"Password Policy"}
                details={
                    <>
                        <p className="text-sm text-gray-700 mb-6">
                            For security purposes, your password must meet the following criteria:
                        </p>

                        <ul className="list-disc ml-6 mb-6">
                            <li>At least 8 characters long</li>
                            <li>Contains at least one uppercase letter (A-Z)</li>
                            <li>Contains at least one lowercase letter (a-z)</li>
                            <li>Contains at least one numeric character (0-9)</li>
                            <li>
                                Contains at least one special character (
                                !@#$%^&*()-_=+[]{ }|;:'",.&lt;?/~)
                            </li>
                        </ul>

                        <p className="text-sm text-gray-700">
                            Please ensure your password meets these requirements to enhance the
                            security of your account. Thank you!
                        </p>
                    </>
                }
            />
        </React.Fragment>
    )
}