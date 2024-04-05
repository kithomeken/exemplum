import React from "react"
import Helmet from "react-helmet"

export const ERR_404 = () => {
    return (
        <React.Fragment>
            <Helmet>
                ERR_404
            </Helmet>

            <div className="p-4">
                <h1 className="text-xl font-semibold">ERR_404</h1>

                <p className="text-sm">
                    Quis enim lobortis scelerisque fermentum dui. Morbi quis commodo odio aenean. Euismod elementum nisi quis eleifend quam adipiscing vitae proin sagittis. Integer quis auctor elit sed vulputate mi sit amet mauris. Tristique senectus et netus et malesuada fames ac turpis egestas. Sed risus ultricies tristique nulla aliquet enim tortor at auctor. Pellentesque elit eget gravida cum. Nunc pulvinar sapien et ligula ullamcorper malesuada. Nibh nisl condimentum id venenatis a. Est lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris augue neque gravida in fermentum.
                </p>
            </div>
        </React.Fragment>
    )
}