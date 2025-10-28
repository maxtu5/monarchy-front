import React, {ReactNode, useContext, useEffect} from 'react';
import {Avatar, Box, Stack, Tooltip, Typography} from '@mui/material';
import {Monarch, Reign, ThroneCardData, ThroneDetails} from "../../utils/types";
import {lifeTime, mergeTwoDates} from "../../utils/functions";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import {base_url, path_graphql_query, request_graphql_thronedetails} from '../../utils/constants';
import {KingdomContext, ModeContext} from "../../utils/context";
import {fetchAllThrones, fetchThroneDetails} from "../../fetchers/fetchers";

interface PersonTileProps {
    displayedThrone?: ThroneCardData,
    displayedMonarch?: Monarch,
    width: string,
    children?: ReactNode,
    displayedReign?: Reign
}

const GenericTile: React.FC<PersonTileProps> = ({
                                                    displayedMonarch,
                                                    width,
                                                    children,
                                                    displayedThrone,
                                                    displayedReign
                                                }) => {
    const {setThrone} = useContext(KingdomContext)
    const {setMode} = useContext(ModeContext)


    function loadThroneDetails() {
        if (!displayedThrone) return
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: request_graphql_thronedetails.replace('_COUNTRY_', displayedThrone.country)
            })
        };
        fetch(`${base_url}${path_graphql_query}`, options)
            .then(response => {
                return response.json();
            })
            .then(data => {
                const details: ThroneDetails = {
                    id: displayedThrone.id,
                    name: displayedThrone.name,
                    country: displayedThrone.country,
                    flagUrl: displayedThrone.flagUrl,
                    monarchs: data.data.throne.allrulers.length + 1,
                    years: displayedThrone.years,
                    restMonarchs: [displayedThrone.lastMonarch, ...data.data.throne.allrulers]
                }
                console.log(details);
                setThrone(details)
                // setMode(1)
            });
    }

    if (displayedReign) console.log(displayedReign)
    return (
        <Box
            sx={{
                p: 1,
                borderRadius: 2,
                border: '1px solid lightgray',
                boxSizing: 'border-box'
            }}
            width={{
                xs: '100%',
                md: width
            }}
        >
            {children}

            {displayedThrone && <Stack spacing={2}>
                <Stack direction="row" spacing={2} onClick={()=> fetchThroneDetails(displayedThrone, setThrone)}>
                    <Tooltip key={displayedThrone.country} title={displayedThrone.country}>
                        <Avatar src={displayedThrone.flagUrl}/>
                    </Tooltip>
                    <Typography variant={'h6'}>
                        {displayedThrone.country}
                    </Typography>
                </Stack>
                <Stack direction={'row'}>
                    <StarOutlineIcon fontSize={'small'}/>
                    <Typography variant="body2" m={0}>
                        {displayedThrone.years}
                    </Typography>
                </Stack>
            </Stack>}

            {displayedMonarch && <Stack direction="row">
                <Box
                    component="img"
                    alt={displayedMonarch.imageCaption}
                    src={displayedMonarch.imageUrl}
                    sx={{
                        width: '100px',
                        height: '120px',
                        objectFit: 'cover',
                    }}
                />
                <Stack sx={{pl: 1}}>
                    {displayedReign &&
                        <Typography variant="body2" component="div">
                            {mergeTwoDates(displayedReign.start, displayedReign.end)}
                        </Typography>}
                    {/*<Typography variant="body2" component="div">*/}
                    {/*{lifeTime(displayedMonarch.birth, displayedMonarch.death)}*/}
                    {/*</Typography>*/}
                </Stack>
            </Stack>}
        </Box>
    );
};

export default GenericTile;