import { connect } from "react-redux";
import { CompetitorsList } from "./CompetitorsList";
import { mapStateToProps } from "./selectors";

export type ConnectedProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps, null)(CompetitorsList);
