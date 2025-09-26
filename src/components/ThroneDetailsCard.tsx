import React, {useContext} from 'react';
import {
    Avatar,
    Box,
    CircularProgress,
    Stack,
    Tooltip,
    Typography
} from "@mui/material";
import {KingdomContext} from "../utils/context";
import DisplayName from "./People/DisplayName";

function mergeTwoDates(start: Date | null, end: Date | null): string {
    const first = start == null ? 'NA' : start.toString().slice(0, 4)
    const last = end == null ? 'NA' : end.toString().slice(0, 4)
    return first + '-' + last
}

function ThroneDetailsCard() {
    const {allThrones, throne} = useContext(KingdomContext)

    if (throne === null) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (<Stack spacing={2}>
            <Stack direction="row" spacing={2}>
                <Tooltip key={throne.country} title={throne.country}>
                    <Avatar src={allThrones.find(t => t.country === throne.country)?.flagUrl}/>
                </Tooltip>
                <Typography variant={'h6'}>
                    {throne.name}
                </Typography>
            </Stack>
            {throne.restMonarchs.map(re => (
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