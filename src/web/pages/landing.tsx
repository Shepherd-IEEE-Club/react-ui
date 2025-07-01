import React from "react";

const LandingPage: React.FC = () => {
    return (
        <div>
            <div className="banner-holder">
                    <div className="row banner-row">
                        <div className="col-lg-5 col-md-6">
                            <div className="banner-text">
                                <h1>World Postal Markings Catalog</h1>
                                <p>
                                    This online database is a listing with illustrations of hand-stamped and manuscript postmarks.
                                    *placeholder text*
                                </p>
                            </div>
                        </div>
                        <div className="col-lg-7 col-md-6">
                            <div className="banner-image">
                                <img src="/src/web/_images/hero-4.jpg" alt="" width="100%"></img>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    );
};

export default LandingPage;
