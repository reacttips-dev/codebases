import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  StyledAIColHeaderWithButton,
  StyledAICol,
  StyledAIResultsListGroupItem,
  StyledAIRow,
  StyledAIResultFormControl,
  StyledHeaderText,
} from "../_components/styled/ai/styledAi";
import CopyToClipboard from "react-copy-to-clipboard";
import {
  StyledAiResultButton,
  StyledCopied,
  StyledTemplateActionsDropDownMenu,
  StyledTemplateActionsDropDownItem,
} from "../_components/styled/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  MAGIC_ENDPOINT,
  SAVED_COPIES,
  COPIES_ENDPOINT,
  MAGIC_DESIGN,
} from "../_actions/endpoints";
import axios from "axios";
import Format from "string-format";
import {
  ShowCenterSpinner,
  ToolTipWrapper,
} from "../_components/common/statelessView";
import { Button, Dropdown, Spinner } from "react-bootstrap";
import { handleHTTPError } from "../_actions/errorHandlerActions";
import { connect, useDispatch } from "react-redux";
import { checkCeleryTaskStatus } from "../_utils/common";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { STORY_DETAIL } from "../_utils/routes";
import { showToast } from "../_actions/toastActions";

const CustomToggle = React.forwardRef(({ onClick }, ref) => (
  <Link
    to={""}
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick(e);
    }}
  >
    <FontAwesomeIcon icon={faEllipsisV} size="1x" color="#fff" />
  </Link>
));

function AiResults(props) {
  let signalToken = axios.CancelToken.source();
  const [copyId, setCopied] = useState(null);
  const [copied, setTextCopied] = useState(false);
  const [submit, isSubmitting] = useState(false);
  const [results, setResults] = useState([]);
  const [selected, setSelectedResults] = useState({});
  const [edit, isEditing] = useState(Array(results.length).fill(false));
  const [headline, setHeadline] = useState("");
  const [favorite, setFavorite] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (props.document.results) {
      let newResults = props.document.results;
      setResults(newResults.concat(results));
      return;
    }
    fetchSavedResults();
    return () => {
      signalToken.cancel("The user aborted a request.");
    };
  }, [props]);

  function updateState(copy, state, index) {
    state = state ? "saved" : "draft";
    axios
      .patch(
        Format(COPIES_ENDPOINT, copy.id),
        { status: state },
        {
          cancelToken: signalToken.token,
        }
      )
      .then((res) => {
        var updatedResults = results;
        if (state === "flagged") {
          updatedResults.splice(index, 1);
        } else {
          updatedResults[index] = res.data;
        }
        setResults([...updatedResults]);
      })
      .catch((error) => {
        dispatch(handleHTTPError(error, props));
      });
  }

  function deleteCopy(id) {
    axios
      .delete(Format(COPIES_ENDPOINT, id), {
        cancelToken: signalToken.token,
      })
      .then((res) => {
        var newResults = results.filter(function (result) {
          return result.id !== id;
        });
        setResults(newResults);
      })
      .catch((error) => {
        dispatch(handleHTTPError(error, props));
      });
  }

  function updateSelection(result) {
    if (selected[result.id]) {
      delete selected[result.id];
    } else {
      selected[result.id] = result.payload;
    }
    setSelectedResults({ ...selected });
  }

  function fetchSavedResults() {
    isSubmitting(true);
    axios
      .get(Format(SAVED_COPIES, props.document.data.id))
      .then((res) => {
        isSubmitting(false);
        let newResults = res.data.results;
        setResults(newResults);
      })
      .catch((error) => {
        isSubmitting(false);
        dispatch(handleHTTPError(error, props));
      });
  }

  function generateContent() {
    isSubmitting(true);
    axios
      .post(Format(MAGIC_ENDPOINT, props.document.data.id))
      .then((res) => {
        checkCeleryTaskStatus(res.data.task_id, () => {})
          .then((res) => {
            isSubmitting(false);
            if (Array.isArray(res.response.info)) {
              let newResults = res.response.info;
              setResults(newResults.concat(results));
            } else if (res.response.info?.error) {
              props.showToast({
                message: res.response.info?.error,
                heading: "Please try again.",
                type: "error",
              });
            }
          })
          .catch((error) => {
            if (error) {
              dispatch(handleHTTPError(error, props));
            }
          });
      })
      .catch((error) => {
        isSubmitting(false);
        dispatch(handleHTTPError(error, props));
      });
  }

  function generateDesign() {
    isSubmitting(true);
    const values = { copies: Object.values(selected) };
    isSubmitting(true);
    axios
      .post(Format(MAGIC_DESIGN, props.document.data.id), values)
      .then((res) => {
        isSubmitting(false);
        if (Array.isArray(res.data)) {
          let newResults = res.data;
          setResults(newResults.concat(results));
        } else {
          const editStoryUrl = Format(
            STORY_DETAIL,
            res.data.organization,
            res.data.id,
            encodeURIComponent(res.data.title)
          );
          window.open(editStoryUrl, "_blank");
        }
      })
      .catch((error) => {
        isSubmitting(false);
        dispatch(handleHTTPError(error, props));
      });
  }

  function editResult(state, index) {
    edit[index] = state;
    isEditing([...edit]);
  }

  function updateHeadline(copy, value, index) {
    const apiBody = {
      payload: {
        headline: value,
      },
    };
    axios
      .patch(Format(COPIES_ENDPOINT, copy.id), apiBody, {
        cancelToken: signalToken.token,
      })
      .then((res) => {
        results[index] = res.data;
        setResults(results);
        editResult(false, index);
      })
      .catch((error) => {
        dispatch(handleHTTPError(error, props));
      });
  }
  const template = props.document.data.prompt.template;

  const resultsView = results.map((result, index) => {
    return (
      <>
        {result.payload && (
          <StyledAIResultsListGroupItem
            key={`${result.id}`}
            hoverEnabled={template === "image"}
            className={selected[result.id] ? "mb-2 active" : "mb-2"}
            onClick={(event) => {
              event.preventDefault();
              if (template === "image") {
                updateSelection(result);
              }
            }}
          >
            <StyledAICol key={`col1_${result.id}`}>
              <div key={`t1_${result.id}`} className={"mb-3"}>
                <>
                  <StyledAIRow className="pl-4 pr-4">
                    <div key={`ts1_${result.id}`} className="mb-3 modified">
                      {result.modified}
                    </div>

                    <div
                      key={`ts2_${result.id}`}
                      className="result-options-container"
                    >
                      <ToolTipWrapper
                        tooltip={"Add to favorites"}
                        key={`fv_${result.id}`}
                        id={`fv_${result.id}`}
                      >
                        <StyledAiResultButton
                          onClick={(event) => {
                            event.stopPropagation();
                            setFavorite(!favorite);
                            updateState(result, !favorite, index);
                          }}
                        >
                          <FontAwesomeIcon
                            icon={"heart"}
                            color={result.status === "saved" ? "#FF4A98" : ""}
                          />
                        </StyledAiResultButton>
                      </ToolTipWrapper>

                      <ToolTipWrapper
                        tooltip={"Copy"}
                        key={`fv1_${result.id}`}
                        id={`fv1_${result.id}`}
                      >
                        <CopyToClipboard
                          key={`t5_${result.id}`}
                          text={
                            result.payload?.cta
                              ? result.payload.headline +
                                "\n" +
                                result.payload.cta
                              : result.payload.headline
                          }
                          onCopy={() => {
                            setTextCopied(true);
                            setCopied(result.id);
                          }}
                        >
                          <StyledAiResultButton>
                            {copyId === result.id ? (
                              <StyledCopied key={`cp_${result.id}`}>
                                <FontAwesomeIcon
                                  icon={"copy"}
                                ></FontAwesomeIcon>{" "}
                                Copied!
                              </StyledCopied>
                            ) : (
                              <>
                                <FontAwesomeIcon
                                  icon={"copy"}
                                ></FontAwesomeIcon>
                              </>
                            )}
                          </StyledAiResultButton>
                        </CopyToClipboard>
                      </ToolTipWrapper>

                      <ToolTipWrapper
                        tooltip={"Move to trash"}
                        key={`tr_${result.id}`}
                        id={`tr_${result.id}`}
                      >
                        <StyledAiResultButton
                          onClick={() => {
                            deleteCopy(result.id);
                          }}
                        >
                          <FontAwesomeIcon icon={"trash"}></FontAwesomeIcon>
                        </StyledAiResultButton>
                      </ToolTipWrapper>

                      <Dropdown drop="down" alignRight>
                        <Dropdown.Toggle
                          as={CustomToggle}
                          id="dropdown-active-artboard-action"
                        />

                        <StyledTemplateActionsDropDownMenu>
                          <StyledTemplateActionsDropDownItem
                            onClick={(e) => {
                              e.stopPropagation();
                              editResult(true, index);
                            }}
                          >
                            Edit
                            <FontAwesomeIcon
                              icon={"pencil-alt"}
                            ></FontAwesomeIcon>{" "}
                          </StyledTemplateActionsDropDownItem>
                          <StyledTemplateActionsDropDownItem
                            onClick={(e) => {
                              e.stopPropagation();
                              updateState(result, "flagged", index);
                            }}
                          >
                            {result.status === "flagged" ? "Flagged" : "Flag"}
                            <FontAwesomeIcon icon={"flag"}></FontAwesomeIcon>
                          </StyledTemplateActionsDropDownItem>
                        </StyledTemplateActionsDropDownMenu>
                      </Dropdown>
                    </div>
                  </StyledAIRow>
                  <div
                    key={`s1_${result.id}`}
                    style={{ cursor: "pointer" }}
                    className={"mb-2 pl-2 pr-2 title"}
                    onClick={(e) => {
                      e.stopPropagation();
                      editResult(true, index);
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      editResult(true, index);
                    }}
                  >
                    {edit[index] ? (
                      <StyledAIResultFormControl
                        as="textarea"
                        defaultValue={result.payload.headline}
                        autoFocus
                        onFocus={(e) => {
                          e.stopPropagation();
                          setHeadline(e.target.value);
                        }}
                        showBorderOnHover={false}
                        onChange={(e) => {
                          setHeadline(e.target.value);
                        }}
                      />
                    ) : props.templateType === "blog" ? (
                      <pre className="blog-headline">
                        {result.payload.headline}
                      </pre>
                    ) : (
                      result.payload.headline
                    )}
                  </div>
                  {edit[index] && (
                    <div className="ai-result-save-action">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          editResult(false, index);
                        }}
                        variant={"tbasic"}
                        className="mr-2"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant={"tprimary"}
                        onClick={(e) => {
                          e.stopPropagation();
                          updateHeadline(result, headline, index);
                        }}
                        disabled={result.payload.headline === headline}
                      >
                        <>
                          Save
                        </>
                      </Button>
                    </div>
                  )}
                </>
              </div>
              {result.payload.cta && (
                <>
                  <div key={`t3_${result.id}`} className="title">
                    {result.payload.subtitle}
                  </div>
                  <div key={`t4_${result.id}`} className={"mb-3"}>
                    {result.payload.cta}
                  </div>
                </>
              )}
            </StyledAICol>
          </StyledAIResultsListGroupItem>
        )}{" "}
      </>
    );
  });

  return (
    <>
      <StyledAIRow>
        <StyledAICol>
          <StyledHeaderText>Results</StyledHeaderText>
          <div>Generate couple of times for the best results</div>
        </StyledAICol>
        <StyledAICol>
          <StyledAIRow>
            <StyledAIColHeaderWithButton align="flex-end">
              <Button
                variant="tbasic"
                disabled={submit}
                onClick={generateContent}
              >
                {!submit ? (
                  "Generate More..."
                ) : (
                  <>
                    {"Please wait..."}
                    <Spinner
                      className={"ml-1"}
                      variant="warning"
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  </>
                )}
              </Button>
            </StyledAIColHeaderWithButton>

            {template === "image" && (
              <StyledAIRow>
                <StyledAIColHeaderWithButton align="flex-end">
                  <Button
                    variant="tprimary"
                    disabled={Object.entries(selected).length === 0}
                    onClick={generateDesign}
                  >
                    {!submit ? (
                      "Generate Creatives"
                    ) : (
                      <>
                        {"Preparing creatives..."}
                        <Spinner
                          className={"ml-1"}
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
                </StyledAIColHeaderWithButton>
              </StyledAIRow>
            )}
          </StyledAIRow>
        </StyledAICol>
      </StyledAIRow>

      {results.length > 0 ? (
        <>{resultsView}</>
      ) : (
        <ShowCenterSpinner loaded={!submit}></ShowCenterSpinner>
      )}
    </>
  );
}

AiResults.propTypes = {
  document: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  document: state.document,
});

const mapDispatchToProps = (dispatch) => {
  return {
    handleHTTPError: (error, props) => dispatch(handleHTTPError(error, props)),
    showToast: (payload) => dispatch(showToast(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AiResults);
