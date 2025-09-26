import React, {useContext} from 'react';
import {AppBar, Box, Button, Toolbar, Typography} from "@mui/material";
import {KingdomContext, ModeContext} from "../utils/context";

function NavBar() {
    const {setMode, allModes} = useContext(ModeContext)
    const {throne} = useContext(KingdomContext)

    return (
        <AppBar position={"sticky"}>
            <Toolbar sx={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap'}}>
                <Typography variant="h6">MAMLAKAT</Typography>
                <Box sx={{display: 'flex', gap: 2}}>
                    {allModes.map(mode => mode.label).map((label, index) => (
                        <Button
                            key={index}
                            color={'inherit'}
                            variant={"outlined"}
                            onClick={() => {
                                setMode(index)
                            }
                        }>
                            {index === 1 ?
                                (throne === null ? label : throne.country) :
                            label}
                        </Button>
                    ))}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;