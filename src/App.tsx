import React from 'react';
import './App.css';
import {Box, Stack} from "@mui/material";
import NavBar from "./components/NavBar";
import Switcher from "./components/Switcher";

function App() {
    return (
        <Box>
            <NavBar/>
            <Switcher/>
        </Box>
    );
}

export default App;
