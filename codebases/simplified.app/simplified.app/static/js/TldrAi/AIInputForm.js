import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ErrorMessage, Form, Formik } from "formik";
import { showToast } from "../_actions/toastActions";
import {
  StyledAiHeaderText,
  StyledAiSubHeaderText,
  StyledAiInputFormField,
} from "../_components/styled/ai/styledAi";
import TldrFormControl from "../_components/common/TldrFormControl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import axios from "axios";
import { useHistory } from "react-router";
import { StyledTldrLabel } from "../_components/styled/styles";
import { handleHTTPError } from "../_actions/errorHandlerActions";
import { resetDocument, updateDocument } from "../_actions/aiDocumentActions";
import {
  DOCUMENTS_ENDPOINT,
  DOCUMENT_DETAILS,
  FIND_DOMAIN,
} from "../_actions/endpoints";
import { analyticsTrackEvent, checkCeleryTaskStatus } from "../_utils/common";
import Format from "string-format";
import { AI_TEMPLATE } from "../_utils/routes";
import TldrVideoInAction from "./TldrVideoInAction";
import TldrSelect from "../_components/common/TldrSelect";

const serviceDescription =
  "We are design and collaboration platform for marketing teams";

const WorkspaceForm = ({ prompt, lastRun, onComplete, resultsView }) => {
  const [titleCounter, setTitleCounter] = useState(80);
  const [descriptionCounter, setDescriptionCounter] = useState(400);
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        title: lastRun.title,
        description: lastRun.description,
        keywords: lastRun.keywords,
        output: lastRun.output,
      }}
      validate={(values) => {
        const errors = {};
        if (prompt.content.title) {
          if (!values.title) {
            errors.title = "Please enter valid input.";
          } else if (values.title.length > 80) {
            errors.title = "No more than 80 characters are allowed.";
          }
        }
        if (prompt.content.description) {
          if (!values.description || values.description.length < 10) {
            errors.description = "Need to know a little bit more.";
          } else if (values.description.length > 400) {
            errors.description = "No more than 400 characters are allowed.";
          }
        }

        if (prompt.content.keywords) {
          if (!values.keywords || values.keywords.length < 10) {
            errors.keywords = "Need to know a little bit more.";
          } else if (values.keywords.length > 400) {
            errors.keywords = "No more than 400 characters are allowed.";
          }
        }

        return errors;
      }}
      onSubmit={(values, { setSubmitting, setErrors }) => {
        let keywods = values["keywords"];
        if (!Array.isArray(keywods)) {
          values["keywords"] = keywods.split(",");
        }
        analyticsTrackEvent("aiGenerate", { language: values.output });
        onComplete(values, { setSubmitting, setErrors });
      }}
    >
      {({ isSubmitting, handleChange, setFieldValue }) => (
        <>
          {!resultsView && !lastRun?.id && (
            <>
              <StyledAiHeaderText>{prompt.content.heroText}</StyledAiHeaderText>
              <StyledAiSubHeaderText>
                {prompt.content.heroDescription}
                {prompt.content.videoInAction !== "" && (
                  <TldrVideoInAction
                    title={prompt.title}
                    videoInAction={prompt.content.videoInAction}
                  />
                )}
              </StyledAiSubHeaderText>
              <br></br>
            </>
          )}
          <Form className={"mt-3"}>
            <div className="input-group mb-3 mt-3">
              <StyledTldrLabel className="mb-1 tldr-flex-grow">
                Select output language
              </StyledTldrLabel>
              <div className="input-group">
                <TldrSelect
                  selectedLanguage={lastRun.output}
                  onSelect={(output) => {
                    setFieldValue("output", output.value);
                  }}
                ></TldrSelect>
              </div>
            </div>
            {prompt.content.title && (
              <>
                <div className="input-group">
                  <StyledTldrLabel className="mb-1 tldr-flex-grow">
                    {prompt.content.title}
                  </StyledTldrLabel>
                  <StyledTldrLabel className="mb-1">
                    {titleCounter}/80
                  </StyledTldrLabel>
                  <StyledAiInputFormField
                    onChange={(e) => {
                      setTitleCounter(e.target.value.length);
                      handleChange(e);
                    }}
                    className="input-group"
                    type="text"
                    name="title"
                    placeholder={
                      lastRun.title
                        ? lastRun.title
                        : prompt.content.title_placeholder
                    }
                  />
                </div>
                <ErrorMessage name="title" component="div" className="error" />
              </>
            )}

            {prompt.content.description && (
              <div className="input-group mb-3 mt-3">
                <StyledTldrLabel className="mb-1 tldr-flex-grow">
                  {prompt.content.description}
                </StyledTldrLabel>
                <StyledTldrLabel className="mb-1">
                  {descriptionCounter}/400
                </StyledTldrLabel>
                <TldrFormControl
                  onChange={(e) => {
                    setDescriptionCounter(e.target.value.length);
                    handleChange(e);
                  }}
                  placeholder={
                    prompt.content.description_ph
                      ? prompt.content.description_ph
                      : serviceDescription
                  }
                  control="textarea"
                  label="description"
                  name="description"
                ></TldrFormControl>
              </div>
            )}

            {prompt.content.keywords && (
              <>
                <div className="input-group mb-3 mt-3">
                  <StyledTldrLabel className="mb-1">
                    {prompt.content.keywords}
                  </StyledTldrLabel>
                  <TldrFormControl
                    placeholder={
                      lastRun?.keywords
                        ? lastRun.keywords
                        : prompt.content.keyword_ph
                        ? prompt.content.keyword_ph
                        : "e.g.Brand marketing, social media design, collaboration, brand campaigns, facebook ads"
                    }
                    control="textarea"
                    label="Keywords"
                    name="keywords"
                  ></TldrFormControl>
                </div>
                {/* <ErrorMessage
                  name="keywords"
                  component="div"
                  className="error"
                /> */}
              </>
            )}

            <div className="input-group mt-3 form-button">
              <Button
                type="submit"
                variant={"tprimary"}
                disabled={isSubmitting}
              >
                {!isSubmitting ? (
                  <>
                    <>
                      Generate{" "}
                      <FontAwesomeIcon
                        icon="magic"
                        className="ml-1"
                      ></FontAwesomeIcon>
                    </>
                  </>
                ) : (
                  <>
                    <Spinner
                      variant={"dark"}
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  </>
                )}
              </Button>
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
};

const DomainNameForm = ({ props, onComplete, onError }) => {
  return (
    <>
      <Formik
        initialValues={{ domain: "" }}
        validate={async (values) => {
          const errors = {};
          if (!values.domain) {
            errors.domain = "Please enter a valid company URL.";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting, setErrors }) => {
          axios
            .get(`${FIND_DOMAIN}?domain=${values.domain}`)
            .then((response) => {
              if (response.data.statusCode === 422) {
                setErrors({
                  domain:
                    "Sorry could not find your domain name, lets try entering your comapny details manually ... ",
                });
                setSubmitting(false);
                onComplete();
              } else {
                setSubmitting(false);
                onComplete(response.data);
              }
            })
            .catch((error) => {
              setSubmitting(false);
              onError();
            });
        }}
      >
        {({ isSubmitting, values, isValid }) => (
          <>
            {
              <>
                <StyledAiHeaderText>
                  {props.prompt.content.heroText}
                </StyledAiHeaderText>
                <StyledAiSubHeaderText>
                  {props.prompt.content.heroDescription}
                  {props.prompt.content.videoInAction !== "" && (
                    <TldrVideoInAction
                      title={props.prompt.title}
                      videoInAction={props.prompt.content.videoInAction}
                    />
                  )}
                </StyledAiSubHeaderText>
                <br></br>
              </>
            }
            <Row>
              <Col md={{ span: 6, offset: 3 }}>
                <Form>
                  <div className="input-group">
                    <div className="mb-1">Enter your company URL</div>
                    <StyledAiInputFormField
                      className="input-group"
                      type="text"
                      name="domain"
                      placeholder="Hint: Google.com"
                    />
                  </div>
                  <ErrorMessage
                    name="domain"
                    component="div"
                    className="error"
                  />

                  <StyledAiSubHeaderText textAlign="left" marginLeft="0.5px">
                    You can skip this step and provide company details yourself.
                  </StyledAiSubHeaderText>

                  <div className="input-group mb-3 mt-3 form-button">
                    <Button
                      type="submit"
                      variant={"tbasic"}
                      className="mr-2"
                      onClick={() => onComplete()}
                    >
                      Skip
                    </Button>
                    <Button
                      type="submit"
                      variant={"tprimary"}
                      disabled={values.domain === "" || !isValid}
                    >
                      {!isSubmitting ? (
                        "Find now"
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
                  </div>
                </Form>
              </Col>
            </Row>
          </>
        )}
      </Formik>
    </>
  );
};

export const AIInput = (props) => {
  const { prompt, document } = props;
  const { data } = document;
  const signalToken = axios.CancelToken.source();
  const history = useHistory();
  const [showWorkspaceForm, setShowWorkpaceForm] = useState(
    !prompt?.content?.domain || false
  );

  const [lastRun, setLastRun] = useState({
    title: data?.payload ? data.payload.title : "",
    keywords: data?.payload ? data.payload.keywords : "",
    description: data?.payload ? data.payload.description : "",
    action: data?.prompt ? data.prompt.template : "copy",
    output: data?.payload ? data.payload.output : "en",
    id: data?.id,
  });

  function fetchLastRun(key = "") {}

  function showFailedMessage(error, setSubmitting) {
    setSubmitting(false);

    if (error) {
      props.handleHTTPError(error, props);
    } else {
      props.showToast({
        message:
          "We are sorry, you are facing this issue. Please contact support.",
        heading: "Oops, this is embarrassing",
        type: "error",
      });
    }
  }

  function createNewDocument(payload, setSubmitting, setErrors) {
    axios
      .post(DOCUMENTS_ENDPOINT, payload, { cancelToken: signalToken.token })
      .then((res) => {
        checkCeleryTaskStatus(res.data.task_id, () => {})
          .then((result) => {
            history.push(Format(AI_TEMPLATE, res.data.id));
          })
          .catch((error) => {
            showFailedMessage(error, setSubmitting);
          });
      })
      .catch((error) => {
        showFailedMessage(error, setSubmitting);
      });
  }

  function updateDocumentRequest(payload, { setSubmitting, setErrors }) {
    axios
      .patch(Format(DOCUMENT_DETAILS, data.id), payload, {
        cancelToken: signalToken.token,
      })
      .then((res) => {
        checkCeleryTaskStatus(res.data.task_id, () => {})
          .then((result) => {
            setSubmitting(false);
            if (Array.isArray(result.response.info)) {
              res.data["results"] = result.response.info;
              props.updateDocument(res.data);
            } else if (result.response.info?.error) {
              props.showToast({
                message: result.response.info?.error,
                heading: "Please try again.",
                type: "error",
              });
            }
          })
          .catch((error) => {
            showFailedMessage(error, setSubmitting);
          });
      })
      .catch((error) => {
        showFailedMessage(error, setSubmitting);
      });
  }

  useEffect(() => {
    fetchLastRun();
    return () => {
      signalToken.cancel("The user aborted a request.");
    };
  }, []);

  return (
    <>
      {!showWorkspaceForm && (
        <DomainNameForm
          props={props}
          onError={() => {
            setShowWorkpaceForm(true);
          }}
          onComplete={(data) => {
            if (data) {
              let companyInfo = {
                ...lastRun,
                title: data.title ? data.title : "",
                keywords: data.keywods ? data.keywords : "",
                description: data.description ? data.description : "",
              };
              setLastRun(companyInfo);
            }
            setShowWorkpaceForm(true);
          }}
        ></DomainNameForm>
      )}
      {showWorkspaceForm && (
        <WorkspaceForm
          resultsView={props.resultsView}
          setShowWorkpaceForm={setShowWorkpaceForm}
          lastRun={lastRun}
          props={props}
          onComplete={(values, { setSubmitting, setErrors }) => {
            if (data?.id) {
              updateDocumentRequest(
                { payload: values },
                { setSubmitting, setErrors }
              );
            } else {
              createNewDocument(
                {
                  title: prompt.title + " document",
                  prompt: prompt.id,
                  payload: values,
                },
                setSubmitting,
                setErrors
              );
            }
          }}
          prompt={prompt ? prompt : data.prompt}
        ></WorkspaceForm>
      )}
    </>
  );
};

AIInput.propTypes = {};

const mapStateToProps = (state) => ({
  document: state.document,
});

const mapDispatchToProps = (dispatch) => {
  return {
    handleHTTPError: (error, props) => dispatch(handleHTTPError(error, props)),
    resetDocument: () => dispatch(resetDocument()),
    updateDocument: (payload) => dispatch(updateDocument(payload)),
    showToast: (payload) => dispatch(showToast(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AIInput);
