import React from 'react';
import {AppBar, Toolbar, Typography} from "@mui/material";

function NavBar() {
    return (
        <AppBar position={"sticky"}>
            <Toolbar>
                <Typography variant={"h6"}>MAMLAKAT</Typography>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;