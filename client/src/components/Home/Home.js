import React, { Component } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import axios from "axios";

import "./style.css";
import Spinner from "../hoc/spinner";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      games: [],
      question: "",
      description: "",
      assigned_games: [],
      loading: false
    };
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  fetchGames = () => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:4000/api/v1/games", {
        headers: {
          token
        }
      })
      .then(res => {
        console.log(res);
        this.setState({
          games: res.data.games
        });
      });
  };

  postQuestion = e => {
    e.preventDefault();
    const { description, question } = this.state;
    const token = localStorage.getItem("token");
    if (description.length < 5 || question.length < 3) {
      alert("All fields are required");
    } else {
      this.setState({
        loading: true
      });
      axios
        .post(
          "http://localhost:4000/api/v1/game",
          { description, question },
          {
            headers: {
              token
            }
          }
        )
        .then(res => {
          if (res.status === 201) {
            this.fetchGames();
            this.setState({
              loading: false
            });
          }
        })
        .catch(error => {
          throw error;
        });
    }
  };

  joinGame = id => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:4000/api/v1/join/${id}`, {
        headers: {
          token
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.fetchGames();
          this.assignedGames();
        }
      })
      .catch(error => {
        if (error) {
          alert("cannot join your own game");
        }
      });
  };

  assignedGames = () => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:4000/api/v1/assigned", {
        headers: {
          token
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            assigned_games: res.data.games
          });
        }
      });
  };

  componentDidMount() {
    this.fetchGames();
    this.assignedGames();
  }

  render() {
    const {
      question,
      description,
      loading,
      games,
      assigned_games
    } = this.state;
    return (
      <React.Fragment>
        <div className="cover-all">
          <form
            onSubmit={this.postQuestion}
            className="text-center question-form"
          >
            <h2>Create Game</h2>
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Question</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder=""
                    name="question"
                    value={question}
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <div className="col-md-12">
                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder=""
                    name="description"
                    value={description}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              onClick={this.postQuestion}
            >
              {loading ? <Spinner /> : "Post"}
            </button>
          </form>
        </div>
        <div className="text-center assign_games">
          <h3>Assigned games</h3>
          {assigned_games.length < 1 ? (
            <div className="no_games">
              <h4>No Games Available</h4>
            </div>
          ) : (
            <div className="container-fluid display_games">
              <div className="row">
                {assigned_games.map(game => (
                  <div className="col-md-4 mb-5" key={game._id}>
                    <div className="card h-100">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">{game.description}</div>
                          <div className="col-md-6 in_progress">
                            {game.status}
                          </div>
                        </div>
                      </div>
                      <div className="card-footer row">
                        <div className="col-md-8">
                          <h6>Life: {game.game_life}</h6>
                          <p>
                            <small>
                              {moment(game.date_created).format("llll")}
                            </small>
                          </p>
                        </div>
                        <div className="col-md-4">
                          <div> Score: {game.game_score}</div>
                          <Link to={`/play_game/${game._id}`}>
                            <button className="form-control btn btn-warning">
                              Play
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="text-center">
          <h3>Available games</h3>
          {games.length < 1 ? (
            <div className="no_games">
              <h4>No Games Available</h4>
            </div>
          ) : (
            <div className="container-fluid display_games">
              <div className="row">
                {games.map(game => (
                  <div className="col-md-4 mb-5" key={game._id}>
                    <div className="card h-100">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">{game.description}</div>
                          <div className="col-md-6 pending-status">
                            {game.status}
                          </div>
                        </div>
                      </div>
                      <div className="card-footer row">
                        <div className="col-md-8">
                          <h6>Life: {game.game_life}</h6>
                          <p>
                            <small>
                              {moment(game.date_created).format("llll")}
                            </small>
                          </p>
                        </div>
                        <div className="col-md-4">
                          <div> Score: {game.game_score}</div>
                          <button
                            onClick={() => {
                              this.joinGame(game._id);
                            }}
                            className="form-control btn btn-success"
                          >
                            Join
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
