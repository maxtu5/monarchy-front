import React, {useContext} from 'react';
import {Avatar, Box, Button, Card, CardActions, CardContent, Stack, Tooltip, Typography} from "@mui/material";
import {ThroneCardData, ThroneDetails} from "../utils/types";
import {base_url, path_graphql_query, request_graphql_thronedetails} from "../utils/constants";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import {truncateText} from "../utils/functions";
import {KingdomContext} from "../utils/context";
import GenericTile from "./shared/GenericTile";
import DisplayName from "./shared/DisplayName";

function ThroneScreen() {
    const {allThrones, throne} = useContext(KingdomContext)

    return <Stack direction="row" spacing={2} display={throne ? "block" : "none"}>
        <Tooltip key={throne?.country} title={throne?.country}>
            <Avatar src={allThrones.find(t => t.country === throne?.country)?.flagUrl}/>
        </Tooltip>
        <Typography variant={'h6'}>
            {throne?.name}
        </Typography>
        <Box sx={{
            p: 1,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 1
        }}>
            {throne?.restMonarchs && throne?.restMonarchs.map(item =>
                <GenericTile width={'25%'} displayedMonarch={item.monarch}>
                    <DisplayName monarch={item.monarch} type={item.reign.title} displayCrown={false}/>
                </GenericTile>)}
        </Box>
    </Stack>
}

export default ThroneScreen;