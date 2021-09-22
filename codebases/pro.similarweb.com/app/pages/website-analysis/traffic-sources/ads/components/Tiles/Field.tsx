import React, { StatelessComponent } from "react";
import PropTypes from "prop-types";

const Field: StatelessComponent<any> = ({ field, title, value, format }) => {
    return (
        <div className={`u-flex-column u-flex-space-between tile-field tile-field-${field}`}>
            <span className="tile-field-header">{`${title}`}</span>
            <span className="tile-field-value">{`${format(value)}`}</span>
        </div>
    );
};

Field.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    format: PropTypes.func.isRequired,
};
export default Field;
