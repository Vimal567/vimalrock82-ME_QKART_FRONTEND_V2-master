import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import { useHistory, Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import "./Header.css";


const Header = ({ children, hasHiddenAuthButtons }) => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  //Back to expolre button
   const backToExploreButton = <Button className="explore-button"
                                  startIcon={<ArrowBackIcon />}
                                  variant="text"
                                  onClick={() => {
                                    history.push("/", {from:"Header"})
                                  }}
                                >
                                  Back to explore
                              </Button>
 
  // Logout method

  let logout = () => {
    localStorage.clear();
    enqueueSnackbar("Logged Out Successfully", {
      variant:"success"
    })
    history.push("/", { from: "Header" })
  }

  // Logout button
  const logOutButton= <Stack direction="row" spacing={1} alignItems="center" key="logout">
                        <Avatar src="avatar.png" alt="crio.do" />
                        <b>{localStorage.getItem("username")}</b>
                        <Button className="link" onClick={logout}>Logout</Button>
                      </Stack>

  //Login Register Button
  const loginRegisterButtons = <Stack direction="row" spacing={1} key="login">
                                  <Link className="link" to="/login"><Button  variant="text">Login</Button></Link>
                                  <Link className="link" to="/register"><Button  variant="contained" >Register</Button></Link>
                                </Stack>
  

 //button checks 
  let buttonCheck = localStorage.getItem("username")? [children, logOutButton] : [children, loginRegisterButtons]
  


    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        {hasHiddenAuthButtons? buttonCheck : backToExploreButton} 
      </Box>
    );
};

export default Header;
