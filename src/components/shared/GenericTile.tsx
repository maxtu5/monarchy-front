import React, {ReactNode} from 'react';
import {Avatar, Box, Stack, Tooltip, Typography} from '@mui/material';
import {Monarch, Reign, Throne, } from "../../utils/types";
import {lifeTime, mergeTwoDates} from "../../utils/functions";
import {useNavigate} from "react-router-dom";
import DisplayName from "./DisplayName";
import {useVisibility} from "../../utils/useVisibility";

interface PersonTileProps {
    displayedThrone?: Throne,
    displayedMonarch?: Monarch,
    width: string,
    children?: ReactNode,
    displayedReign?: Reign
}

function ThroneTileContent(props: { throne: Throne }) {
    const navigate = useNavigate();

    return (<Stack
            sx={{
                cursor: "pointer",
                p: 1,
                "&:hover": {backgroundColor: "rgba(0,0,0,0.04)"},
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
                <Tooltip title={props.throne.country}>
                    <Avatar
                        sx={{border: "1px solid lightgray"}}
                        src={props.throne.flagUrl}
                        onClick={() => navigate(`/throne/${props.throne.country.toLowerCase()}`)}
                    />
                </Tooltip>

                {/* Row 1, Col 2 — Name + Years */}
                <Box sx={{overflow: "hidden"}}
                     onClick={() => navigate(`/throne/${props.throne.country.toLowerCase()}`)}
                >
                    <Typography variant="h6" noWrap>
                        {props.throne.name}
                    </Typography>
                    <Typography variant="body2">
                        {props.throne.years}
                    </Typography>
                </Box>

                {/* Row 2, Col 1 — empty cell */}
                <Box>
                    <Typography variant="caption" color="text.secondary">
                        {props.throne.exists ? 'CURRENT' : 'LATEST'}
                    </Typography>

                </Box>

                {/* Row 2, Col 2 — New Typography + DisplayName */}
                <Box sx={{overflow: "hidden"}}>

                    <DisplayName
                        monarch={props.throne.lastMonarch}
                        type=""
                        displayCrown={true}
                    />
                </Box>
            </Box>
        </Stack>
    );
}

function NobleTileContent(props: { reign: Reign | undefined, monarch: Monarch }) {
    return ( <Stack direction="row">
        <Box
            component="img"
            alt={props.monarch.imageCaption}
            src={props.monarch.imageUrl}
            sx={{
                width: '100px',
                height: '120px',
                objectFit: 'cover',
            }}
        />
        <Stack>
            {props.reign ?
                <Typography variant="body2" component="div">
                    {mergeTwoDates(props.reign.start, props.reign.end)}
                </Typography> :

                <Stack sx={{pl: 1}}>
                    <Typography variant="body2" component="div">
                        {mergeTwoDates(props.monarch.birth, props.monarch.death)}
                    </Typography>
                    <Typography variant="body2" component="div">
                        {lifeTime(props.monarch.birth, props.monarch.death)}
                    </Typography>
                </Stack>}
            {/*<Typography variant="body2" component="div">*/}
            {/*{lifeTime(props.monarch.birth, props.monarch.death)}*/}
            {/*</Typography>*/}
        </Stack>
    </Stack>);
}

const GenericTile: React.FC<PersonTileProps> = ({
                                                    displayedMonarch,
                                                    width,
                                                    children,
                                                    displayedThrone,
                                                    displayedReign
                                                }) => {

    const { ref, isVisible } = useVisibility<HTMLDivElement>({
        rootMargin: "200px",   // preload before entering viewport
        threshold: 0.1
    });

    return (
        <Box
            ref={ref}
            sx={{
                width: width,
                p: 1,
                borderRadius: 2,
                border: "1px solid lightgray",
                boxSizing: "border-box",
                flexShrink: 0,
                bgcolor: "white"
            }}
        >
            {/* Always render lightweight children */}
            {children}

            {/* Heavy content loads only when visible */}
            {isVisible && displayedThrone && (
                <ThroneTileContent throne={displayedThrone} />
            )}

            {isVisible && displayedMonarch && (
                <NobleTileContent
                    monarch={displayedMonarch}
                    reign={displayedReign}
                />
            )}
        </Box>
    );
};

export default GenericTile;