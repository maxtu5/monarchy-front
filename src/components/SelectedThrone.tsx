import {Avatar, Box, Stack, Tooltip, Typography} from "@mui/material";
import GenericTile from "./shared/GenericTile";
import DisplayName from "./shared/DisplayName";
import React, {useContext, useEffect} from "react";
import {KingdomContext} from "../utils/context";
import {Monarch, Reign} from "../utils/types";

export function SelectedThrone() {
    const {allThrones, throne} = useContext(KingdomContext)
    const [displayed, setDisplayed] = React.useState<{
        reign: Reign,
        monarch: Monarch
    }[]>([])

    useEffect(() => {
        setDisplayed(throne?.restMonarchs ? throne.restMonarchs : [])
    }, [throne?.restMonarchs]);
    console.log('physically ', displayed)

    return (<Box sx={{width: '20%', display: 'flex', flexDirection: 'column', paddingTop: 1}}>
        {/* Sticky top section */}
        <Box sx={{
            position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'background.paper', p: 1, borderBottom: '1px solid',
            borderColor: 'divider',
        }}>
            <Stack direction="row" spacing={1} sx={{width: '100%'}}>
                <Tooltip key={throne?.country} title={throne?.country}>
                    <Avatar sx={{
                        border: '1px solid lightgray',
                    }}
                            src={allThrones.find(t => t.country === throne?.country)?.flagUrl}/>
                </Tooltip>
                <Typography variant="h6" noWrap>
                    {throne?.name}
                </Typography>
            </Stack>
        </Box>

        {/* Scrollable bottom section */}
        <Box sx={{flexGrow: 1, overflowY: 'auto', p: 1}}>
            <Stack spacing={1}>
                {displayed.map((item, index) => (
                    <GenericTile key={index} width="100%" displayedMonarch={item.monarch}
                                 displayedReign={item.reign}>
                        <DisplayName monarch={item.monarch} type={item.reign.title} displayCrown={false}/>
                    </GenericTile>
                ))}
            </Stack>
        </Box>

    </Box>);
}