import React, {useContext} from 'react';
import {Box, CircularProgress, Divider, Typography} from "@mui/material";
import {KingdomContext} from "../../utils/context";
import {Throne} from "../../utils/types";
import {ThroneClassifier} from "./ThroneClassifier";

const sortThrones = (a: Throne, b: Throne): number => {
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

function Classifier() {
    return (<Box sx={{m: 1, bgcolor: "#ddd"}}>

        <Box sx={{display: "flex", justifyContent: "space-between", m: 1}}>
            <Typography variant={'h5'}>Browse thrones</Typography>
        </Box>
        <Divider sx={{mb: 0}}/>

        <ThroneClassifier/>
    </Box>);
}

function AllThronesScreen() {
    const {allThrones} = useContext(KingdomContext)

    if (allThrones.length === 0) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh'}}>
                <CircularProgress/>
            </Box>
        );
    }

    return (
        <>
            <Classifier/>
        </>
    );
}

export default AllThronesScreen;