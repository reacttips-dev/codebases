import React, { useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import TldrAINavbar from "./TldrAINavbar";
import { DOCUMENT_DETAILS } from "../_actions/endpoints";
import Format from "string-format";
import { handleHTTPError } from "../_actions/errorHandlerActions";
import { useState } from "react";
import { ShowCenterSpinner } from "../_components/common/statelessView";
import AIInputForm from "./AIInputForm";
import { StyledAiEditor } from "../_components/styled/ai/styledAi";
import AiResults from "./AiResults";
import TldrAiBase from "./TldrAiBase";
import { Col } from "react-bootstrap";
import TldrCollpasibleSectionSettings from "../_components/settings/TldrCollpasibleSectionSettings";
import { updateDocument } from "../_actions/aiDocumentActions";
import { StyledInterComWrapper } from "../TldrApp/TldrHomeBaseStyles";
import { IntercomCustomIcon } from "../_components/styled/home/statelessView";

export const TldrAiEditor = (props) => {
  let signalToken = axios.CancelToken.source();
  const [loaded, setLoaded] = useState(false);

  function fetchDocumentDetails(promptId) {
    axios
      .get(Format(DOCUMENT_DETAILS, promptId))
      .then((res) => {
        props.updateDocument(res.data);
        setLoaded(true);
      })
      .catch((error) => {
        props.handleHTTPError(error, props);
      });
  }

  useEffect(() => {
    const {
      params: { promptId },
    } = props.match;

    fetchDocumentDetails(promptId);
    return () => {
      signalToken.cancel("The user aborted a request.");
    };
  }, []);

  const { data } = props.document;
  return (
    <>
      <ShowCenterSpinner loaded={loaded} />

      {loaded && (
        <>
          <TldrAINavbar document={data}></TldrAINavbar>
          <StyledAiEditor className={"mt-4"}>
            <Col sm={5}>
              <TldrAiBase className="ai-box mb-4">
                <TldrCollpasibleSectionSettings
                  collapse={false}
                  subtitle={data.prompt.content.heroDescription}
                  title={data.prompt.title}
                >
                  <div className="tldr-hl"></div>
                  <AIInputForm resultsView={true}></AIInputForm>
                </TldrCollpasibleSectionSettings>
              </TldrAiBase>
            </Col>
            <Col>
              <TldrAiBase className="ai-box mb-4">
                <AiResults templateType={data.prompt.template}></AiResults>
              </TldrAiBase>
            </Col>
          </StyledAiEditor>
          <StyledInterComWrapper className="d-none d-sm-none d-md-block">
            <IntercomCustomIcon />
          </StyledInterComWrapper>
        </>
      )}
    </>
  );
};

TldrAiEditor.propTypes = {};

const mapStateToProps = (state) => {
  return {
    document: state.document,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleHTTPError: (error, props) => dispatch(handleHTTPError(error, props)),
    updateDocument: (payload) => dispatch(updateDocument(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TldrAiEditor);
