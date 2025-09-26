import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import DisplayName from './DisplayName';
import {Monarch} from "../../utils/types";
import {lifeTime, mergeTwoDates} from "../../utils/functions"; // adjust import path as needed

interface Props {
    monarch: Monarch | null;
    type: string;
}

const FamilyMemberCard: React.FC<Props> = ({ monarch, type }) => {
    if (!monarch) return null;

    return (
        <Box
            key={monarch.id}
            sx={{
                p: 1,
                borderRadius: 2,
                border: '1px solid lightgray'
            }}
            width={{
                xs: '100%', // mobile
                md: '30%' // desktops and up
            }}


        >
            <DisplayName monarch={monarch} type={type} displayCrown={monarch.reigns.length>0} />
            <Stack direction="row">
                <Box
                    component="img"
                    alt={monarch.imageCaption}
                    src={monarch.imageUrl}
                    sx={{
                        width: '100px',
                        height: '120px',
                        objectFit: 'cover',
                        borderRadius: 2
                    }}
                />
                <Stack sx={{ pl: 1 }}>
                    <Typography variant="body2" component="div">
                        {mergeTwoDates(monarch.birth, monarch.death)}
                    </Typography>
                    <Typography variant="body2" component="div">
                        {lifeTime(monarch.birth, monarch.death)}
                    </Typography>
                </Stack>
            </Stack>
        </Box>
    );
};

export default FamilyMemberCard;