import React from 'react';
import {Route, Switch, Redirect} from "react-router-dom";
import MainLayout from 'layouts/MainLayout.js';
import './App.css';

function App() {
  return (
    <Switch>
        {/* add routes with layouts */}
        <Route path="/" component={MainLayout}/>
        <Redirect from="*" to="/"/>
    </Switch>
  );
}

export default App;
