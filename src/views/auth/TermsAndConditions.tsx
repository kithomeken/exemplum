import React, { FC } from "react"

import { Basic_Modal_Props } from "../../lib/modules/Interfaces"
import { InformationalModal } from "../../lib/hooks/InformationalModal"

export const TermsAndConditions: FC<Basic_Modal_Props> = ({ show, showOrHide }) => {
    return (
        <React.Fragment>
            <InformationalModal
                size={"lg"}
                show={show}
                showOrHide={showOrHide}
                title={"Terms & Conditions"}
                details={
                    <>
                        <div className="prose prose-lg text-sm text-stone-600 gap-y-3 flex flex-col">
                            <div className="max-w-4xl mx-auto px-4 py-8">
                                <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>

                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold mb-4">1. Account Registration</h2>
                                    <p className="text-gray-700">
                                        1.1. In order to use certain features of the App, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information as necessary to keep it accurate, current, and complete.
                                    </p>
                                    <p className="text-gray-700">
                                        1.2. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to immediately notify the Company of any unauthorized use of your account or any other breach of security.
                                    </p>
                                </section>

                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold mb-4">2. Financial Transactions</h2>
                                    <p className="text-gray-700">
                                        2.1. The App may facilitate monetary transactions, including but not limited to purchases, payments, and transfers ("Transactions"). You agree that all Transactions made through the App are subject to the following terms:
                                    </p>
                                    <p className="text-gray-700">
                                        2.2. Payment Information: You agree to provide accurate and up-to-date payment information for any Transactions conducted through the App. You authorize the Company to charge your designated payment method for any applicable fees, charges, or purchases.
                                    </p>
                                    <p className="text-gray-700">
                                        2.3. Transaction Disputes: In the event of a dispute regarding a Transaction, you agree to contact the Company's customer support team promptly to resolve the issue. The Company reserves the right to investigate and, at its discretion, provide refunds or credits for disputed Transactions.
                                    </p>
                                    <p className="text-gray-700">
                                        2.4. Currency Conversion: If Transactions involve currency conversion, exchange rates may apply. You acknowledge that exchange rates may vary and agree to bear any associated fees or charges.
                                    </p>
                                </section>

                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold mb-4">3. Fees and Charges</h2>
                                    <p className="text-gray-700">
                                        3.1. The Company may charge fees for certain features or services provided through the App. You agree to pay all applicable fees and charges incurred in connection with your use of the App.
                                    </p>
                                    <p className="text-gray-700">
                                        3.2. Fee Changes: The Company reserves the right to change its fee structure at any time, with or without notice. Continued use of the App after such changes constitute acceptance of the new fee structure.
                                    </p>
                                </section>

                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold mb-4">4. Liability and Indemnification</h2>
                                    <p className="text-gray-700">
                                        4.1. The Company shall not be liable for any damages, losses, or expenses arising out of or in connection with your use of the App, including but not limited to any errors, omissions, or inaccuracies in Transactions.
                                    </p>
                                    <p className="text-gray-700">
                                        4.2. You agree to indemnify and hold harmless the Company, its affiliates, and their respective officers, directors, employees, and agents from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or in connection with your use of the App.
                                    </p>
                                </section>

                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold mb-4">5. Governing Law</h2>
                                    <p className="text-gray-700">
                                        5.1. These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction]. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of [Jurisdiction].
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-xl font-semibold mb-4">6. Amendments</h2>
                                    <p className="text-gray-700">
                                        6.1. The Company reserves the right to amend or modify these Terms at any time, with or without notice. Any changes to these Terms will be effective immediately upon posting. Your continued use of the App following the posting of any changes constitutes acceptance of those changes.
                                    </p>
                                </section>

                                <section className="mt-8">
                                    <p className="text-gray-700">
                                        If you have any questions or concerns about these Terms, please contact us at [Contact Email].
                                    </p>
                                </section>
                            </div>

                        </div>
                    </>
                }
            />
        </React.Fragment>
    )
}