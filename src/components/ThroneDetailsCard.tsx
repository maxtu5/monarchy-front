import React, {useContext} from 'react';
import {Avatar, Box, Button, Card, CardActions, CardContent, Stack, Tooltip, Typography} from "@mui/material";
import {Monarch, ThroneCardData, ThroneDetails} from "../utils/types";
import {KingdomContext} from "../utils/context";
import DisplayName from "./People/DisplayName";
import {mergeTwoDatesCol} from "../utils/functions";

function mergeTwoDates(start: Date | null, end: Date | null): string {
    const first = start == null ? 'NA' : start.toString().slice(0, 4)
    const last = end == null ? 'NA' : end.toString().slice(0, 4)
    return first + '-' + last
}

interface Props {
    selectedThrone: ThroneDetails | null,
    setMode: (value: number) => void
}

function ThroneDetailsCard({selectedThrone, setMode}: Props) {
    const {thrones} = useContext(KingdomContext)


    // @ts-ignore
    return selectedThrone == null ? (<span/>) :
        (<Stack spacing={2}>
            <Stack direction="row" spacing={2}>
                <Tooltip key={selectedThrone.country} title={selectedThrone.country}>
                    <Avatar src={thrones.find(t => t.country === selectedThrone.country)?.flagUrl}/>
                </Tooltip>
                <Typography variant={'h6'}>
                    {selectedThrone.name}
                </Typography>
            </Stack>
            {selectedThrone.restMonarchs.map(re => (
                <Stack direction="row" spacing={1}>
                    <Stack>
                        <Typography>{re.reign.end === null ? 'NA' : re.reign.end.toString().slice(0, 4)}</Typography>
                        <Typography>{re.reign.start === null ? 'NA' : re.reign.start.toString().slice(0, 4)}</Typography>
                    </Stack>
                    <Avatar src={re.monarch.imageUrl} title={re.monarch.imageUrl}/>
                    <DisplayName monarch={re.monarch} type={re.reign.title} displayCrown={false}/>
                </Stack>
            ))}
        </Stack>)
}

export default ThroneDetailsCard;