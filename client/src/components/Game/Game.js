import React, { Component } from "react";
import moment from "moment";
import axios from "axios";

import "./style.css";
import CustomNav from "../Navbar/CustomNav";

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameId: this.props.match.params.id,
      game: "",
      answer: "",
      game_response: ""
    };
  }
  fetchGame = () => {
    const token = localStorage.getItem("token");
    const { gameId } = this.state;
    axios
      .get(`/api/v1/assigned/${gameId}`, {
        headers: {
          token
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            game: res.data.games
          });
        }
      });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  playGame = e => {
    e.preventDefault();
    const { answer, gameId } = this.state;
    const token = localStorage.getItem("token");
    axios
      .post(
        `/api/v1/play/${gameId}`,
        { answer },
        {
          headers: {
            token
          }
        }
      )
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          this.fetchGame();
          this.setState({
            game_response: res.data.message,
            answer: ""
          });
        }
      });
  };

  componentDidMount() {
    this.fetchGame();
  }

  render() {
    const { game, answer, game_response } = this.state;
    return (
      <div>
        <CustomNav />
        <div className="container">
          <div className="card h-100 single_game">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">{game.description}</div>
                <div className="col-md-6 in_progress">{game.status}</div>
              </div>
            </div>
            <div className="card-footer row">
              <div className="col-md-8">
                <h6>Life: {game.game_life}</h6>
                <p>
                  <small>{moment(game.date_created).format("llll")}</small>
                </p>
              </div>
              <div className="col-md-4">
                <div> Score: {game.game_score}</div>
              </div>
            </div>
          </div>
          <div className="play_form">
            <form className="row">
              <div className="form-group col-md-6">
                <input
                  className="form-control"
                  name="answer"
                  value={answer}
                  onChange={this.handleChange}
                  type="text"
                />
                <button
                  onClick={this.playGame}
                  className="form-control btn btn-warning"
                >
                  play
                </button>
              </div>
              <div className="col-md-6 game_response">{game_response}</div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Game;
