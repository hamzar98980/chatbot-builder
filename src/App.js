import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import ClassicRoutes from "./routes/Classic";
import AuthRoutes from "./routes/AuthRoutes";
import "bootstrap/js/src/collapse";
import ScrollToTop from "./utils/ScrollToTop";
import Cookies from "js-cookie";

function App() {
  // const { user: auth } = useAuth();

  const auth = Cookies.get("refreshToken");

  return (
    <>
      <ScrollToTop>
        <Switch>
          {auth ? (
            <>
              <Route
                path="/"
                render={(props) => <ClassicRoutes {...props} />}
              />
            </>
          ) : (
            <>
              <Redirect exact from="/" to="/auth/login" />
              <Route
                path="/auth"
                render={(props) => <AuthRoutes {...props} />}
              />
            </>
          )}
        </Switch>
      </ScrollToTop>
    </>
  );
}

export default App;
