import React from 'react';
import {Stack} from "@mui/material";
import PersonalDetailsCard from "./PersonalDetailsCard";
import FamilyCard from "./FamilyCard";
import ReignCard from "./Reign/ReignCard";

function MonarchPanel() {

    return (
        <Stack spacing={2}>
            <PersonalDetailsCard/>
            <ReignCard/>
            <FamilyCard/>


        </Stack>
    );
}

export default MonarchPanel;