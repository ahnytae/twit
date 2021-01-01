import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

// internal components
import Main from "./routes/Main";
import Auth from "./routes/Auth";
import Profile from "./routes/Profile";
import NavComponent from "./common/NavComponent";

const AppRouter = ({ isLoggedIn }) => {
  return (
    <>
      <BrowserRouter>
        {isLoggedIn && <NavComponent />}
        <Switch>
          {isLoggedIn ? (
            <>
              <Route exact path="/main">
                <Main />
              </Route>
              <Route exact path="/profile">
                <Profile />
              </Route>
              <Redirect from="*" to="/main" />
            </>
          ) : (
            <>
              <Route exact path="/">
                <Auth />
              </Route>
              <Redirect from="*" to="/" />
            </>
          )}
        </Switch>
      </BrowserRouter>
    </>
  );
};

export default AppRouter;
