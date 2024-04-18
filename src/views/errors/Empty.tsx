/*
* Error template to be shown when
* no records are found.
*
* i.e. Error 400, 500 etc.
*
* */

import React, { FC } from "react"
import emptyBox from "../../assets/images/empty_box.png"

interface emptyProps {
	title?: string,
	description: any
}

export const Empty: FC<emptyProps> = ({description, title = 'No results found'}) => {
	return (
		<React.Fragment>
			<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
				<div className="flex flex-col items-center">
					<div className="mx-auto flex-shrink-0 flex items-center justify-center mb-3 sm:mx-0 w-32">
						<img src={emptyBox} alt="broken_robot" width="auto" className="block text-center m-auto" />
					</div>

					<div className="mt-3 text-center m-auto text-slate-600">
						<span className="text-slate-700 mb-2 block">
							{title}
						</span>

						<div className="text-sm">
							{description}
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	)
}