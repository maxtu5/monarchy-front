import React, {useContext, useEffect, useState} from "react";
import {KingdomContext} from "../../utils/context";
import {Box, Stack, Typography} from "@mui/material";
import DisplayName from "../shared/DisplayName";

export function ThroneDetails() {
    const {throne} = useContext(KingdomContext);
    const [connectedThrones, setConnectedThrones] = useState<string[]>([]);

    useEffect(() => {
        if (!throne) return;
        // fetchConnectedThrones(throne.id).then((a:)=>setConnectedThrones)
    }, [throne]);

    return (
        <Box display={'flex'} flexDirection={'column'}>
            <Typography variant="h6" color="text.secondary">
                Historical era
            </Typography>
            <Typography color="text.secondary">
                {throne?.years}
            </Typography>

            <Typography variant="h6" color="text.secondary">
                Rulers ({throne?.reigns.length})
            </Typography>
            <Stack direction="row" spacing={2} alignItems={'baseline'}>
                <DisplayName
                    monarch={throne===null ? null : throne.lastMonarch}
                    type="Last"
                    displayCrown={false}
                />
            </Stack>
            <Stack direction="row" spacing={2} alignItems={'baseline'}>
                <DisplayName
                    monarch={throne?.reigns[throne?.reigns.length - 1].monarch || null}
                    type="First"
                    displayCrown={false}
                />
            </Stack>

            <Typography variant="h6" color="text.secondary">
                Throne connections
            </Typography>
            {/*{allThrones*/}
            {/*    .filter(t => connectedThrones.includes(t.country))*/}
            {/*    .map(th => (null*/}
            {/*        // <ThroneRow image={th.flagUrl} name={th.name}/>*/}
            {/*    ))}*/}
        </Box>
    );
}