import * as React from "react";

import PageContent from "components/PageContent";
import Header from "components/Header";
import Footer from "components/Footer";

import * as styles from "./style.css";
import ProductReviewVerification from "./ProductReviewVerification";

export const ProductReviewVerificationPage: React.FC = () => {
    return (
        <div className={styles.container} data-automation="verification-page">
            <Header />
                <PageContent>
                    <ProductReviewVerification />
                </PageContent>
            <Footer />
        </div>
    );
};

export default ProductReviewVerificationPage;
