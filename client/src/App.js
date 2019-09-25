import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Register from "./components/User/Register";
import Login from "./components/User/Login";
import Game from "./components/Game/Game";

function App() {
  return (
    <Switch>
      <Route exact path="/games" component={Home} />
      <Route exact path="/" component={Register} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/play_game/:id" component={Game} />
    </Switch>
  );
}

export default App;
