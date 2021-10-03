import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";
import {
  AI_ENDPOINT,
  AI_WRITER_ENDPOINT,
  FETCH_CATEGORIES,
} from "../_actions/endpoints";
import { ShowCenterSpinner } from "../_components/common/statelessView";
import TLDRInfiniteScroll from "../_components/common/TLDRInfiniteScroll";
import {
  StyledAiHeaderText,
  StyledAiSubHeaderText,
  StyledAiTemplate,
} from "../_components/styled/ai/styledAi";

import {
  StyledAICategories,
  StyledRoundedPill,
} from "../_components/styled/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Format from "string-format";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { CATEGORY_COPY } from "../_components/details/constants";
import { analyticsTrackEvent } from "../_utils/common";

export const AITemplates = (props) => {
  let signalToken = axios.CancelToken.source();

  const [loading, isLoaded] = useState(false);
  const [results, setResults] = useState([]);

  const [filter, setFilter] = useState("all");
  const [categories, setCategories] = useState([]);

  function loadMoreData() {}

  function fetchCategories() {
    axios
      .get(Format(FETCH_CATEGORIES, CATEGORY_COPY), {
        cancelToken: signalToken.token,
      })
      .then((res) => {
        let newResults = res.data.results;
        setCategories(
          [{ id: "all", title: "all", display_name: "All" }].concat(newResults)
        );
      })
      .catch((error) => {});
  }

  function fetchAiTemplates(key = "") {
    let endpoint = key ? Format(AI_WRITER_ENDPOINT, key) : AI_ENDPOINT;
    axios
      .get(endpoint)
      .then((res) => {
        isLoaded(true);
        setResults(res.data.results);
      })
      .catch((error) => {
        isLoaded(true);
      });
  }

  useEffect(() => {
    fetchCategories(CATEGORY_COPY);
    fetchAiTemplates();
    return () => {
      signalToken.cancel("The user aborted a request.");
    };
  }, []);

  function onFilterChange(key) {
    setFilter(key);
    fetchAiTemplates(key === "all" ? "" : key);
  }

  const childElements = results.map((result) => {
    return (
      <StyledAiTemplate
        key={`${result.id}`}
        className={
          result.id === props.wizardData?.goals?.template.id
            ? "ai-selected"
            : ""
        }
        onClick={(e) => {
          props.onComplete("goals", result);

          analyticsTrackEvent("selectedAIGoal", {
            template: result.title,
          });
        }}
      >
        <div className="icon new-document-icon" key={`${result.id}_icon`}>
          {result?.content?.iconType === "brand" ? (
            <FontAwesomeIcon icon={["fab", `${result.content.icon}`]} />
          ) : result?.content?.icon ? (
            <FontAwesomeIcon icon={`${result.content.icon}`} />
          ) : (
            <FontAwesomeIcon icon={"pencil-alt"} size="lg" />
          )}
        </div>
        <div className="info-container">
          <div className="title" key={`${result.id}_title`}>
            {result.title}
          </div>
          {result.description.length >= 70 ? (
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>{result.description}</Tooltip>}
              trigger={["hover", "focus"]}
              key={`${result.id}_sub`}
            >
              <div className="subtitle description">{result.description}</div>
            </OverlayTrigger>
          ) : (
            <div className="subtitle" key={`${result.id}_sub`}>
              {result.description}
            </div>
          )}
        </div>
      </StyledAiTemplate>
    );
  });

  const categoriesView = categories.map((category, index) => {
    return (
      <StyledRoundedPill
        key={index}
        className="template-categories"
        tldrbtn={filter === category.id ? "primary" : "default"}
        onClick={() => onFilterChange(category.id)}
      >
        {category.display_name}
      </StyledRoundedPill>
    );
  });

  return (
    <>
      <ShowCenterSpinner loaded={loading}>Please wait</ShowCenterSpinner>
      <StyledAiHeaderText>
        <FontAwesomeIcon icon={faRobot} className="mr-2" />
        What can I help you with today?
      </StyledAiHeaderText>
      <StyledAiSubHeaderText className={"mb-3"}>
        Select a template from below
      </StyledAiSubHeaderText>
      <StyledAICategories>{categoriesView}</StyledAICategories>
      <TLDRInfiniteScroll
        className={"ai-new-document-infinite-scroll p-3"}
        childrens={childElements}
        hasMore={false}
        loadMoreData={loadMoreData}
        loaded={false} // Change its value whenever data get loaded.
      />
    </>
  );
};

AITemplates.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, null)(AITemplates);
