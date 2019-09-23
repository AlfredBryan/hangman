import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Register from "./components/User/Register";
import Login from "./components/User/Login";

function App() {
  return (
    <Switch>
      <Route exact path="/game" component={Home} />
      <Route exact path="/" component={Register} />
      <Route exact path="/login" component={Login} />
    </Switch>
  );
}

export default App;
