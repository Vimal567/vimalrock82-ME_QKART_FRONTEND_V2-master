import React from "react"
import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import { Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import Checkout from "./components/Checkout";
import Thanks from "./components/Thanks";

export const config = {
  endpoint: `https://qkart-frontend-vimal.herokuapp.com/api/v1`,
};


function App() {
  return (
      <React.StrictMode>
          <div className="App">
            {/* TODO: CRIO_TASK_MODULE_LOGIN - To add configure routes and their mapping */}
                  <Switch>
                    <Route exact path="/" component={Products}></Route>
                    <Route path="/login" component={Login}></Route>
                    <Route path="/register" component={Register}></Route>
                    <Route path="/checkout" component={Checkout}></Route>
                    <Route path="/thanks" component={Thanks}></Route>
                  </Switch>
          </div>
      </React.StrictMode>
  );
}

export default App;
