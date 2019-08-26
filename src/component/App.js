import React from "react";
import Display from "./Display";
import ButtonPanel from "./ButtonPanel";
import calculate from "../logic/calculate";
import "./App.css";

export default class App extends React.Component {
  state = {
    total: null,
    operations: null,
  };

  handleClick = buttonName => {
    this.setState(calculate(this.state, buttonName));
  };

  render() {
    return (
      <div className="component-app">
        <Display total={this.state.total || "0"} operations={this.state.operations || "0"} />
        <ButtonPanel clickHandler={this.handleClick} />
      </div>
    );
  }
}
