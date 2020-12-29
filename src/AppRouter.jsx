import { BrowserRouter, Switch, Route } from "react-router-dom";

// internal components
import Main from "./routes/Main";
import Auth from "./routes/Auth";

const AppRouter = ({ isLoggedIn }) => {
  return (
    <>
      <BrowserRouter>
        <Switch>
          {isLoggedIn ? (
            <Route exact path="/">
              <Main />
            </Route>
          ) : (
            <Route exact path="/">
              <Auth />
            </Route>
          )}
        </Switch>
      </BrowserRouter>
    </>
  );
};

export default AppRouter;
