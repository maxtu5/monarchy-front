import React, {ReactNode} from 'react';
import {Box, Stack, Typography} from '@mui/material';
import DisplayName from '../DisplayName';
import {Monarch} from "../../../utils/types";
import {lifeTime, mergeTwoDates} from "../../../utils/functions"; // adjust import path as needed

interface PersonTileProps {
    monarch?: Monarch;
    width: string;
    children?: ReactNode;
}

const PersonTile: React.FC<PersonTileProps> = ({ monarch, width, children }) => {
    // console.log(monarch.imageUrl)
    return (
        <Box
            sx={{
                p: 1,
                borderRadius: 2,
                border: '1px solid lightgray'
            }}
            width={{
                xs: '100%',
                md: width
            }}
        >
            {children}
            {monarch && <Stack direction="row">
                <Box
                    component="img"
                    alt={monarch.imageCaption}
                    src={monarch.imageUrl}
                    sx={{
                        width: '100px',
                        height: '120px',
                        objectFit: 'cover',
                    }}
                />
                <Stack sx={{pl: 1}}>
                    <Typography variant="body2" component="div">
                        {mergeTwoDates(monarch.birth, monarch.death)}
                    </Typography>
                    <Typography variant="body2" component="div">
                        {lifeTime(monarch.birth, monarch.death)}
                    </Typography>
                </Stack>
            </Stack>}
        </Box>
    );
};

export default PersonTile;