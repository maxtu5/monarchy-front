import React, {useContext} from 'react';
import {Box, CircularProgress, Grid2} from "@mui/material";
import ThroneCard from "./ThroneCard";
import {KingdomContext, ModeContext} from "../utils/context";

function ThronesArea() {
    const {setMode} = useContext(ModeContext);
    const {allThrones, setThrone} = useContext(KingdomContext)

    if (allThrones.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid2 container spacing={1}>
                {allThrones.map((item, index) => (
                    <Grid2 size={{xs: 12, sm: 6, md: 3}} key={index}>
                        <ThroneCard
                            throneData={item}
                            // @ts-ignore
                            setDetailsData={setThrone}
                            setMode={setMode}
                        />
                    </Grid2>
                ))}
            </Grid2>
        </Box>

    );
}

export default ThronesArea;