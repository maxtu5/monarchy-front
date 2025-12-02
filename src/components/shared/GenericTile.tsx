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

    // if (displayedReign) console.log(displayedReign)
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

            {displayedThrone && <Stack direction="row" spacing={2} alignItems="flex-start"
                       onClick={() => {
                           setThrone(null)
                           fetchThroneDetails(displayedThrone, setThrone)
                       }}
                >
                    <Tooltip key={displayedThrone.country} title={displayedThrone.country}>
                        <Avatar sx={{
                            border: '1px solid lightgray',
                        }}
                                src={displayedThrone.flagUrl}/>
                    </Tooltip>
                    <Stack sx={{width: '100%', overflow: 'hidden'}}>
                        <Typography variant={'h6'} noWrap>
                            {displayedThrone.name}
                        </Typography>
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
                <Stack>
                    {displayedReign ?
                        <Typography variant="body2" component="div">
                            {mergeTwoDates(displayedReign.start, displayedReign.end)}
                        </Typography> :

                    <Stack sx={{pl: 1}}>
                        <Typography variant="body2" component="div">
                            {mergeTwoDates(displayedMonarch.birth, displayedMonarch.death)}
                        </Typography>
                        <Typography variant="body2" component="div">
                            {lifeTime(displayedMonarch.birth, displayedMonarch.death)}
                        </Typography>
                    </Stack>}
                    {/*<Typography variant="body2" component="div">*/}
                    {/*{lifeTime(displayedMonarch.birth, displayedMonarch.death)}*/}
                    {/*</Typography>*/}
                </Stack>
            </Stack>}
        </Box>
    );
};

export default GenericTile;