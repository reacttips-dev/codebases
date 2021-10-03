import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  StyledModal,
  StyledModalBody,
  StyledModalFooter,
  StyledModalHeader,
  StyledModalTitle,
  StyledProductCardsWrapper,
} from "../styled/partners/stylesPartners";
import { Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { GENERATE_ASSETS, SEARCH_SHOPIFY } from "../../_actions/endpoints";
import { ProductImageItem, ShowCenterSpinner } from "../common/statelessView";
import TldrSearch from "../common/TldrSearch";
import Format from "string-format";
import { getPayloadFromShopify, getUserMetaData } from "../../_utils/common";
import TLDRInfiniteScroll from "../common/TLDRInfiniteScroll";
import { MY_APPS } from "../../_utils/routes";
import { ImageSources } from "../../_actions/types";

function TldrGuidedTour(props) {
  let signal = axios.CancelToken.source();
  const [products, setProducts] = useState({ edges: [], pageInfo: {} });
  const [selectedProducts, setSelectedProducts] = useState({});
  const [isSubmitting, setSubmitting] = useState(false);
  const [enablePartner, setEnablePartner] = useState(false);
  const [loading, setLoading] = useState(true);

  function fetchProuctsFromShopify(cursor, query) {
    setLoading(true);
    axios
      .post(
        SEARCH_SHOPIFY,
        { cursor: cursor, query: query },
        { cancelToken: signal.cancelToken }
      )
      .then((res) => {
        setLoading(false);
        var newProducts = {
          ...products,
          edges: products.edges.concat(res.data.data.products.edges),
          pageInfo: res.data.data.products.pageInfo,
        };
        setProducts(newProducts);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 404) {
          setEnablePartner(true);
        }
      });
  }

  function searchProductsFromShopify(query) {
    setProducts({ edges: [], pageInfo: {} });
    fetchProuctsFromShopify(null, query);
  }

  useEffect(() => {
    fetchProuctsFromShopify(null, null);
    return () => {
      signal.cancel("The user aborted a request.");
    };
  }, []);

  function addSelectedProduct(product) {
    setSelectedProducts({
      ...selectedProducts,
      [product.node.id]: product,
    });
  }

  function loadMoreData() {
    const lastEdge = products.edges[products.edges.length - 1];
    fetchProuctsFromShopify(lastEdge.cursor, null);
  }

  function generateAssets() {
    setSubmitting(true);
    let payload = [];
    for (const [value] of Object.entries(selectedProducts)) {
      payload.push(getPayloadFromShopify(value));
    }

    axios
      .post(Format(GENERATE_ASSETS, props.templateId), payload, {
        cancelToken: signal.cancelToken,
      })
      .then((res) => {
        setSubmitting(false);
        props.onComplete(res);
      })
      .catch((error) => {
        setSubmitting(false);
      });
  }

  function openSettings() {
    window.location = MY_APPS;
  }

  const childElements =
    products &&
    products.edges &&
    products.edges.map((image, index) => {
      const payload = {
        mime: "image",
        payload: {},
        content: {
          meta: getUserMetaData(ImageSources.SHOPIFY, image),
        },
      };
      return (
        <>
          <div className="item-product-div" key={index}>
            <div
              key={`${image.id}_${index}`}
              className={
                selectedProducts[image.node.id] !== undefined
                  ? "item-product active"
                  : "item-product"
              }
              onClick={() => addSelectedProduct(image)}
              data-groupkey={image.groupKey}
            >
              {image.node.featuredImage && (
                <ProductImageItem
                  data={payload}
                  key={`${image.id}_${Date.now()}`}
                  url={image.node.featuredImage.originalSrc}
                  alt={image.alt_description}
                  width={100}
                  height={100}
                  source={"Shopify"}
                  showOverlayInfo={true}
                />
              )}
            </div>
            <div className="title">{image.node.title}</div>
          </div>
        </>
      );
    });

  return (
    <StyledModal
      show={true}
      backdrop="static"
      onHide={props.onHide}
      size="lg"
      scrollable={true}
      centered
    >
      <StyledModalHeader>
        <StyledModalTitle>Select products</StyledModalTitle>
      </StyledModalHeader>
      <hr className="modal-hr" />
      <StyledModalBody>
        {enablePartner ? (
          "To use this template, connect with your Shopify store first."
        ) : products.edges.length > 0 ? (
          <>
            <TldrSearch
              onSearch={searchProductsFromShopify}
              placeholder={"Search Products"}
              width={"250px"}
              size="sm"
            />

            {products.edges.length > 0 ? (
              <StyledProductCardsWrapper
                className="mt-3"
                id={"shopifyProductList"}
                style={{ overflowY: "auto" }}
              >
                <TLDRInfiniteScroll
                  className={"guided-infinite-scroll"}
                  childrens={childElements}
                  hasMore={products.pageInfo.hasNextPage}
                  loadMoreData={loadMoreData}
                  loaded={false} // Change its value whenever data get loaded.
                  scrollableTarget={"shopifyProductList"} // Pass id of parent div. That must be scrollable.
                />
              </StyledProductCardsWrapper>
            ) : (
              <div className="text-center mt-3 mb-3">No product found</div>
            )}
          </>
        ) : (
          <ShowCenterSpinner loaded={!loading} />
        )}
      </StyledModalBody>
      <StyledModalFooter>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            props.onHide();
          }}
          variant="outline-warning"
          disabled={false}
        >
          Cancel
        </Button>
        {enablePartner ? (
          <Button
            onClick={openSettings}
            className="btn btn-warning tldr-login-btn"
          >
            Go to settings
          </Button>
        ) : (
          <Button
            onClick={generateAssets}
            className="btn btn-warning tldr-login-btn"
            disabled={
              isSubmitting || Object.entries(selectedProducts).length === 0
            }
          >
            {!isSubmitting ? (
              "Generate Assets (" +
              Object.entries(selectedProducts).length +
              ")"
            ) : (
              <>
                <Spinner
                  variant="dark"
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              </>
            )}
          </Button>
        )}
      </StyledModalFooter>
    </StyledModal>
  );
}

TldrGuidedTour.propTypes = {
  templateId: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired,
};

export default TldrGuidedTour;
