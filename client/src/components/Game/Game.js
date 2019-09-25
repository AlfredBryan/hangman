import React, { Component } from "react";

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameId: this.props.match.params.id,
      game: ""
    };
  }
  render() {
    return (
      <div>
        <div className="container"></div>
      </div>
    );
  }
}

export default Game;
