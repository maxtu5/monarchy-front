import React, {useContext, useEffect, useState} from 'react';
import {Box, Grid2, Stack, Typography} from "@mui/material";
import PersonalDetailsCard from "./PersonalDetailsCard";
import FamilyCard from "./FamilyCard";
import ReignCard from "./Reign/ReignCard";
import {KingdomContext} from "../../utils/context";
import {second_url} from "../../utils/constants";

function MonarchPanel() {
    const {monarch} = useContext(KingdomContext)
    const [desc, setDesc] = useState<string>("");

    useEffect(() => {
        if (monarch?.description) return
        const request = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }
        // console.log(monarch?.id)
        // console.log(request)

        fetch(`${second_url}/data/monarchs/descbyid/${monarch?.id}`, request)
            .then(response => {
                return response.text();
            })
            .then(data => {
                setDesc(data)
            })
    }, [monarch])

    return (
        <Grid2
            container
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                m: 1
            }}
        >
            <Grid2 size={12}>
                <Typography variant="h5" component="div">
                    {monarch?.name}
                </Typography>
            </Grid2>

            <Grid2
                size={{xs: 12, sm: 3}}
            >
                <PersonalDetailsCard/>
            </Grid2>
            <Grid2 size={{xs: 12, sm: 8}}>
                <Stack>
                    <Typography m={1} variant={"body2"}>
                        {monarch?.description == "" ? desc : monarch?.description}
                    </Typography>
                    <ReignCard/>
                    <FamilyCard/>
                </Stack>
            </Grid2>


        </Grid2>
    );
}

export default MonarchPanel;