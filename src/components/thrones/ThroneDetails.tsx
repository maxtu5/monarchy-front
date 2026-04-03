import React, {useContext, useEffect, useState} from "react";
import {KingdomContext} from "../../utils/context";
import {Box, Stack, Typography} from "@mui/material";
import DisplayName from "../shared/DisplayName";
import {Flags} from "../shared/Flags";

export function ThroneDetails() {
    const {throne, setThrone} = useContext(KingdomContext);

    useEffect(() => {
        if (!throne || throne.connectedThrones) return;
        const connections = new Map<string, string[]>();

        for (const r of throne.reigns) {
            const monarch = r.monarch;
            if (!monarch) continue;

            for (const rr of monarch.reigns) {
                if (rr.country === throne.country) continue;

                const list = connections.get(rr.country);
                if (list) {
                    list.push(monarch.id);
                } else {
                    connections.set(rr.country, [monarch.id]);
                }
            }
        }
        setThrone({...throne, connectedThrones: connections})
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
            <Stack spacing={1}>
            {Array.from(throne?.connectedThrones?.keys() || []).map(t => (
                <Flags key={t} countries={[t]}/>
            ))}
            </Stack>
        </Box>
    );
}