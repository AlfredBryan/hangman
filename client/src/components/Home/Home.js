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
        });
    }
  };

  componentDidMount() {
    this.fetchGames();
  }

  render() {
    const { question, description, loading, games } = this.state;
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
                  <Link className="col-md-4 mb-5" to={`/play_game/${game._id}`}>
                    <div key={game._id} >
                      <div className="card h-100">
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">New Game</div>
                            <div className="col-md-6">{game.status}</div>
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
                            Score: {game.game_score}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
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
