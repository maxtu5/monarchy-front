import React, {useContext} from 'react';
import {Box, CircularProgress} from "@mui/material";
import {KingdomContext, ModeContext} from "../utils/context";
import GenericTile from "./shared/GenericTile";
import {SelectedThrone} from "./SelectedThrone";
import {ThroneCardData} from "../utils/types";

const sortThrones = (a: ThroneCardData, b: ThroneCardData): number => {
    const aHasNow = a.years.toLowerCase().includes('now');
    const bHasNow = b.years.toLowerCase().includes('now');
    const getStartYear = (years: string): number => {
        const match = years.match(/^(\d{1,4})/);
        return match ? parseInt(match[1], 10) : Infinity;
    };
    const getEndYear = (years: string): number => {
        const match = years.match(/(\d{1,4})$/);
        return match ? parseInt(match[1], 10) : -Infinity;
    };
    if (aHasNow && !bHasNow) return -1;
    if (!aHasNow && bHasNow) return 1;
    if (aHasNow && bHasNow) {
        return getStartYear(a.years) - getStartYear(b.years); // earlier start year first
    }
    return getEndYear(b.years) - getEndYear(a.years);
}

function AllThronesScreen() {
    const {setMode} = useContext(ModeContext);
    const {allThrones,} = useContext(KingdomContext)

    if (allThrones.length === 0) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh'}}>
                <CircularProgress/>
            </Box>
        );
    }

    return (
        <Box sx={{display: 'flex', height: '100vh', overflow: 'hidden'}}>
            {/* Left column: 20% width */}
            <SelectedThrone/>
            {/* Right column: 80% width */}
            <Box
                sx={{

                    width: '80%',
                    p: 1,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    overflowY: 'auto',
                    alignContent: 'flex-start',
                }}
            >
                {allThrones.sort(sortThrones)
                    .map((item, index) => (
                        <GenericTile key={index} width="24%" displayedThrone={item}/>
                    ))}
            </Box>
        </Box>
    );
}

export default AllThronesScreen;