import React from "react";
import Header from "components/Headers/Header";
import {Route, Switch, Redirect} from "react-router-dom";
import MainPage from "pages/MainPage";
import ExploreLazyNFT from "pages/ExploreLazyNFT";

export default function MainLayout() {
  return (
    <>
      <div className="container mt-3">
        {/* <AdminNavbar /> */}
        {/* Header */}
        <Header />
        <div className="mt-5">
          <Switch>
            <Route path="/main/" exact component={MainPage} />
            <Route path="/explore/" exact component={ExploreLazyNFT} />
            <Redirect from="/" to="/main/" />
          </Switch>
        </div>
      </div>
    </>
  );
}
