import { connect } from "react-redux";
import { EditableCompetitor } from "./EditableCompetitor";
import { fetchWebsites } from "../../store/effects";

export type ConnectedProps = ReturnType<typeof mapDispatchToProps>;

const mapDispatchToProps = (dispatch) => {
    return {
        fetchSimilarWebsites: (country: number, benchmark: string, q: string) =>
            dispatch(fetchWebsites(country, benchmark, q)),
    };
};

export default connect(null, mapDispatchToProps)(EditableCompetitor);
