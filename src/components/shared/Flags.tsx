import {Avatar, Stack, Tooltip, Typography} from "@mui/material";
import React, {useContext} from "react";
import {KingdomContext} from "../../utils/context";

export function Flags(props: { countries: string[] }) {
    const {allThrones} = useContext(KingdomContext)

    return (<Stack direction={'row'} spacing={1}>{props.countries.map(country => (
        <Tooltip key={country} title={country}>
            <Avatar sx={{width: 24, height: 24}}
                    src={allThrones.find(t => t.country === country)?.flagUrl}/>
        </Tooltip>

    ))}
        <Typography variant={'body2'}
                    sx={{color: 'text.secondary'}}>{props.countries.join(', ')}</Typography>
    </Stack>);
}