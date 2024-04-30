/*
* Error template to be shown when
* communication breaks-down/terminates.
*
* i.e. Error 400, 500 etc.
*
* */

import React from "react"
import emptyBox from "../../assets/images/.512023.png"

export const CommsBreakdown = () => {
	return (
		<React.Fragment>
			<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
				<div className="flex flex-col items-center">
					<div className="mx-auto flex-shrink-0 flex items-center justify-center mb-3 w-80 sm:mx-0 ">
						<img src={emptyBox} alt="broken_robot" width="auto" className="block text-center m-auto" />
					</div>

					<div className="mt-3 text-center m-auto text-slate-600">
					<span className="text-gray-700 mb-2 block">
							Communication Breakdown
						</span>

						<div className="text-sm">
							Connection failed, kindly check your internet connection.
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	)
}