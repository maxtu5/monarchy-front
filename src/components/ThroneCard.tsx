import React from 'react';
import {Avatar, Box, Button, Card, CardActions, CardContent, Stack, Tooltip, Typography} from "@mui/material";
import {ThroneCardData, ThroneDetails} from "../utils/types";
import {base_url, path_graphql_query, request_graphql_thronedetails} from "../utils/constants";
import StarOutlineIcon from "@mui/icons-material/StarOutline";

interface Props {
    throneData: ThroneCardData,
    setDetailsData: (d: ThroneDetails | null) => void,
    setMode: (value: number) => void
}

function ThroneCard({throneData, setDetailsData, setMode}: Props) {

    function loadDetails() {
        // @ts-ignore
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: request_graphql_thronedetails.replace('_COUNTRY_', throneData.country)
            })
        };
        fetch(`${base_url}${path_graphql_query}`, options)
            .then(response => {
                return response.json();
            })
            .then(data => {
                const details: ThroneDetails = {
                    id: throneData.id,
                    name: throneData.name,
                    country: throneData.country,
                    flagUrl: throneData.flagUrl,
                    monarchs: data.data.throne.allrulers.length + 1,
                    years: throneData.years,
                    restMonarchs: [throneData.lastMonarch, ...data.data.throne.allrulers]
                }
                setDetailsData(details)
                setMode(1)
            });
    }

    const card = (
        <React.Fragment>
            <CardContent onClick={loadDetails}>
                <Stack>
                    <Stack direction={'row'} spacing={1}>
                        <Stack spacing={1}>
                            <Tooltip key={throneData.country} title={throneData.country}>
                                <Avatar src={throneData.flagUrl}/>
                            </Tooltip>
                            <Stack direction={'row'}>
                                <StarOutlineIcon fontSize={'small'}/>
                                <Typography variant="body2" m={0}>
                                    {throneData.monarchs}
                                </Typography>
                            </Stack>
                        </Stack>
                        <Stack>
                            <Typography variant="h6" component="div">
                                {throneData.name}
                            </Typography>

                            <Typography sx={{color: 'text.secondary'}}>{throneData.years}</Typography>


                            <Typography variant="body2">
                                {(throneData.lastMonarch.monarch.death === null ? 'Current: ' : 'Last: ') + throneData.lastMonarch.monarch.name}
                            </Typography>

                        </Stack>
                    </Stack>

                </Stack>
            </CardContent>
        </React.Fragment>
    );

    return (
        <Box sx={{minWidth: 250, maxWidth: 350}}>
            <Card variant="outlined" sx={{margin: 1}}>{card}</Card>
        </Box>);
}

export default ThroneCard;