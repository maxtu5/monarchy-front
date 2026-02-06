import React, {ReactNode, useContext, useEffect} from 'react';
import {Avatar, Box, Stack, Tooltip, Typography} from '@mui/material';
import {Monarch, Reign, Throne, ThroneDetails} from "../../utils/types";
import {lifeTime, mergeTwoDates} from "../../utils/functions";
import {KingdomContext, ModeContext} from "../../utils/context";
import {useNavigate} from "react-router-dom";
import DisplayName from "./DisplayName";

interface PersonTileProps {
    displayedThrone?: Throne,
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
    const navigate = useNavigate();

    // if (displayedReign) console.log(displayedReign)
    return (
        <Box
            sx={{
                width: width,
                p: 1,
                borderRadius: 2,
                border: '1px solid lightgray',
                boxSizing: 'border-box',
                flexShrink: 0,
                bgcolor: 'white'
            }}
        >
            {children}

            {displayedThrone &&
                <Stack
                    sx={{
                        cursor: "pointer",
                        p: 1,
                        "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                        borderRadius: 1
                    }}
                >
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "auto 1fr",   // ← left = content width, right = fill
                            gridTemplateRows: "auto auto",
                            columnGap: 2,
                            rowGap: 0.5,
                            alignItems: "start"
                        }}
                    >
                        {/* Row 1, Col 1 — Avatar */}
                        <Tooltip title={displayedThrone.country}>
                            <Avatar
                                sx={{ border: "1px solid lightgray" }}
                                src={displayedThrone.flagUrl}
                                onClick={() => navigate(`/throne/${displayedThrone.country.toLowerCase()}`)}
                            />
                        </Tooltip>

                        {/* Row 1, Col 2 — Name + Years */}
                        <Box sx={{ overflow: "hidden" }}
                             onClick={() => navigate(`/throne/${displayedThrone.country.toLowerCase()}`)}
                        >
                            <Typography variant="h6" noWrap>
                                {displayedThrone.name}
                            </Typography>
                            <Typography variant="body2">
                                {displayedThrone.years}
                            </Typography>
                        </Box>

                        {/* Row 2, Col 1 — empty cell */}
                        <Box>
                            <Typography variant="caption" color="text.secondary">
                                {displayedThrone.exists ? 'CURRENT' : 'LATEST'}
                            </Typography>

                        </Box>

                        {/* Row 2, Col 2 — New Typography + DisplayName */}
                        <Box sx={{ overflow: "hidden" }}>

                            <DisplayName
                                monarch={displayedThrone.lastMonarch}
                                type=""
                                displayCrown={true}
                            />
                        </Box>
                    </Box>
                </Stack>
            }


            {/*//     <Stack direction="row" spacing={2} alignItems="flex-start"*/}
            {/*//            onClick={() => {*/}
            {/*//                    navigate(`/throne/${displayedThrone.country.toLowerCase()}`);*/}
            {/*//                }}*/}
            {/*//     >*/}
            {/*//         <Tooltip key={displayedThrone.country} title={displayedThrone.country}>*/}
            {/*//             <Avatar sx={{*/}
            {/*//                 border: '1px solid lightgray',*/}
            {/*//             }}*/}
            {/*//                     src={displayedThrone.flagUrl}/>*/}
            {/*//         </Tooltip>*/}
            {/*//         <Stack sx={{overflow: 'hidden'}}>*/}
            {/*//             <Typography variant={'h6'} noWrap>*/}
            {/*//                 {displayedThrone.name}*/}
            {/*//             </Typography>*/}
            {/*//             <Typography variant="body2" m={0}>*/}
            {/*//                 {displayedThrone.years}*/}
            {/*//             </Typography>*/}
            {/*//             <DisplayName monarch={displayedThrone.lastMonarch.monarch} type={''} displayCrown={true}/>*/}
            {/*//*/}
            {/*//         </Stack>*/}
            {/*// </Stack>}*/}

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