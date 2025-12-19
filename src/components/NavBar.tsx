import React, {useContext} from 'react';
import {AppBar, Box, Button, Toolbar, Typography} from "@mui/material";
import {KingdomContext, ModeContext} from "../utils/context";

function NavBar() {
    const {mode, setMode, allModes} = useContext(ModeContext)
    const {monarch} = useContext(KingdomContext)

    return (
        <AppBar position={"sticky"}>
            <Toolbar sx={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap'}}>
                <Typography variant="h6">MONARCHY</Typography>
                <Box sx={{display: 'flex', gap: 2}}>
                    {allModes.map(mode => mode.label).map((label, index) => (
                        <Button
                            key={index}
                            variant={"outlined"}
                            disabled={index===1 && monarch===null}
                            sx={{
                                bgcolor: mode === index ? "white" : "inherit",
                                color: mode === index ? "primary" : "inherit"
                            }}
                            onClick={() => {
                                setMode(index)
                            }
                            }>
                            {label}
                        </Button>
                    ))}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;