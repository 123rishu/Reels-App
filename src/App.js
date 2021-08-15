import React, { useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import Header from "./Components/Header";
import Feeds from "./Components/Feeds";
import Login from "./Components/Login";
import Profile from "./Components/Profile";
import Signup from "./Components/Signup";
import { AuthContext, AuthProvider } from "./context/AuthProvider";

function App() {
  let { currUser } = useContext(AuthContext);

  return (
    <Router>
      <div className="App">
        <Header></Header>
        <Switch>
          {currUser ? (
            <>
              <Route path="/" component={Feeds} exact></Route>
              <Route path="/profile/:id" component={Profile} exact></Route>
              <Redirect to="/"></Redirect>
            </>
          ) : (
            <>
              <Route path="/login" component={Login} exact></Route>
              <Route path="/signup" component={Signup} exact></Route>
              <Redirect to="/login"></Redirect>
            </>
          )}
        </Switch>
      </div>
    </Router>
  );
}

function PrivateRoute(props) {
  let { comp: Component, path } = props;
  // Feeds ?? loggedIn and path="/"
  let { currUser } = useContext(AuthContext);
  console.log(currUser);
  // let currUser = true;
  return currUser ? (
    <Route path={path} component={Component}></Route>
  ) : (
    <Redirect to="/login"></Redirect>
  );
}

export default App;