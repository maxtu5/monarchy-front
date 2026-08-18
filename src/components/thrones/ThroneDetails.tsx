import React, {useMemo, useState} from "react";
import {Box, Checkbox, Stack, Typography} from "@mui/material";
import DisplayName from "../shared/DisplayName";
import {Flags} from "../shared/Flags";
import {ThronePlus} from "../../utils/types";

interface ThroneDetailsProps {
    throne: ThronePlus,
    setThrone: (value: (ThronePlus | null)) => void,
    displayConnections: boolean,
    setDisplayConnections: (value: boolean) => void,
    connectedThronesMap: Map<string, string[]>
}

export function ThroneDetails({
                                  throne,
                                  setThrone,
                                  displayConnections,
                                  setDisplayConnections,
                                  connectedThronesMap
                              }: ThroneDetailsProps) {

    const connectedCountries = useMemo(() => Array.from(connectedThronesMap.keys()), [connectedThronesMap]);

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
            <Typography variant="h6" color="text.secondary">
                Historical era
            </Typography>
            <Typography color="text.secondary">
                {throne?.years}
            </Typography>

            <Typography variant="h6" color="text.secondary">
                Rulers ({throne?.reigns?.length || 0})
            </Typography>
            <Stack direction="row" spacing={2} sx={{alignItems: 'baseline'}}>
                <DisplayName
                    monarch={throne === null ? null : throne.lastMonarch}
                    type="Last"
                    displayCrown={false}
                />
            </Stack>
            <Stack direction="row" spacing={2} sx={{alignItems: 'baseline'}}>
                <DisplayName
                    monarch={throne?.reigns && throne.reigns.length > 0
                        ? throne.reigns[throne.reigns.length - 1].monarch
                        : null
                    }
                    type="First"
                    displayCrown={false}
                />
            </Stack>

            {/* THRONE CONNECTIONS */}
            <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <Typography variant="h6">Connections</Typography>
                <Checkbox
                    checked={displayConnections}
                    onChange={() => setDisplayConnections(!displayConnections)}
                    sx={{
                        '& .MuiSvgIcon-root': {fontSize: 16}
                    }}
                />
            </Box>

            {displayConnections && (connectedCountries.length === 0 ? 'NONE' : (
                <Stack spacing={1} sx={{mt: 1}}>
                    {connectedCountries.map(countryName => (
                        <Flags key={countryName} countries={[countryName]}/>
                    ))}
                </Stack>
            ))}

        </Box>
    );
}