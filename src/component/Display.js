import React from "react";
import PropTypes from "prop-types";

import "./Display.css";

export default class Display extends React.Component {
  static propTypes = {
    total: PropTypes.string,
    operations: PropTypes.string,
  };

  render() {
    return (
      <div className="component-display">
        <div>{this.props.total}</div>
        <div className="additional-info">{this.props.operations}</div>
      </div>
    );
  }
}
