import React, {useContext} from 'react';
import {Avatar, Box, CircularProgress, Grid2, Stack, Tooltip, Typography} from "@mui/material";
import {KingdomContext, ModeContext} from "../utils/context";
import GenericTile from "./shared/GenericTile";
import DisplayName from "./People/DisplayName";

function AllThronesScreen() {
    const {setMode} = useContext(ModeContext);
    const {allThrones, throne, setThrone} = useContext(KingdomContext)

    if (allThrones.length === 0) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh'}}>
                <CircularProgress/>
            </Box>
        );
    }

    return (

        <Box sx={{display: 'flex', overflow: 'hidden'}}>
            {/* Left column: 20% width */}
            <Box sx={{width: '20%', pl: 1, pt: 1}}>
                <Stack>
                    <Stack direction={'row'} spacing={1} sx={{width: '100%'}}>
                        <Tooltip key={throne?.country} title={throne?.country}>
                            <Avatar src={allThrones.find(t => t.country === throne?.country)?.flagUrl}/>
                        </Tooltip>
                        <Typography variant={'h6'}>
                            {throne?.name}
                        </Typography>
                    </Stack>
                    <Box sx={{pl: 1, pt: 1}}>
                        <Stack spacing={2}>
                            {throne?.restMonarchs && throne?.restMonarchs.map(item =>
                                <GenericTile width={'100%'} displayedMonarch={item.monarch} displayedReign={item.reign}>
                                    <DisplayName monarch={item.monarch} type={item.reign.title} displayCrown={false}/>
                                </GenericTile>)}
                        </Stack>
                    </Box>
                </Stack>
            </Box>



            {/* Right column: 80% width */}
            <Box
                sx={{
                    width: '80%',
                    p: 1,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    overflowY: 'auto',
                    alignContent: 'flex-start',
                }}
            >
                {allThrones.map((item, index) => (
                    <GenericTile key={index} width="24%" displayedThrone={item}/>
                ))}
            </Box>
        </Box>
    );
}

export default AllThronesScreen;