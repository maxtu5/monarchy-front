import React from 'react';
import {Box, Button} from '@mui/material';

interface OpenerCardProps {
    setShowAll: (b: boolean)=>void
}

const OpenerTile = ({setShowAll}: OpenerCardProps) => {

    return (<Box
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
        <Button onClick={()=>setShowAll(true)}>Show more relatives</Button>
    </Box>);
};

export default OpenerTile;