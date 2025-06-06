import React, {useContext} from 'react';
import {Box} from "@mui/material";
import Grid from '@mui/material/Grid2';
import ThroneCard from "./ThroneCard";
import {KingdomContext} from "../utils/context";

interface Props {
    setMode: (value: number)=>void
}

function ThronesArea({setMode}: Props) {
    const {thrones, setSelectedThrone} = useContext(KingdomContext)

    return (
        <Box sx={{flexGrow: 1}}>
            <Grid container spacing={2}>
                {thrones.map((item) => (
                    <Grid size={4}>
                        <ThroneCard
                            throneData={item}
                            // @ts-ignore
                            setDetailsData={setSelectedThrone}
                            setMode={setMode}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default ThronesArea;