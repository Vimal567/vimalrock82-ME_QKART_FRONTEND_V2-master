import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";


const Login = () => {
  const { enqueueSnackbar } = useSnackbar();

  const person = {
    username: "",
    password: ""
  }

  const [Users, setUsers] = useState(person);
  const [loading, setLoading] = useState(false);
  const history = useHistory()


  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
const login = async (formData) => {
    console.log(Users);
    const FullFormData = { ...formData};

    try{
      setLoading(true);
      const res = await axios.post(`${config.endpoint}/auth/login`, FullFormData);
      const data = res.data;
      console.log(data);
      setLoading(false);
      
       //Persist login data
      persistLogin(data.token,data.username,data.balance);
      enqueueSnackbar('Logged in successfully',{ 
        variant: 'success',
      })
      history.push("/",{ from: "Login" });
    }
    catch(e){
      setLoading(true);
      console.log(e.response);
      if (e.response && e.response.status === 400)
      {
        setLoading(false);
        return enqueueSnackbar( e.response.data.message, { variant: 'error'},);
      }
      else {
        setLoading(false);
        enqueueSnackbar( "Something went wrong. Check that the backend is running, reachable and returns valid JSON.", { variant: 'error'});
      }
    }
    
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = (data) => {
    let ValidData = {...data}

    if(!ValidData.username){
      enqueueSnackbar("Username is required", {variant: "warning"});
      return false;
    }
    if(!ValidData.password) {
      enqueueSnackbar("Password is required", {variant: 'warning'})
      return false;
    }

    return login(ValidData);
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUsers(Users => ({ ...Users, [name]: value }));
  };


  const persistLogin = (token, username, balance) => {
    localStorage.setItem("username", username);
    localStorage.setItem("token", token);
    localStorage.setItem("balance", balance);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons={false}/>
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>
          <TextField 
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            value={Users.username}
            onChange={handleInput}
          />
          <TextField 
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            fullWidth
            value={Users.password}
            onChange={handleInput}
          />
          {loading===true ? 
          <Box display="flex" flexDirection="row" justifyContent="center"> 
          <CircularProgress className="loading" color="success"/></Box>:
           <Button className="button" variant="contained" onClick={()=>validateInput(Users)}>
            Login To QKart
           </Button>}

          <p className="secondary-action">
            Don't have an account?{" "}
            <Link className="link" to="/register">Register now</Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
