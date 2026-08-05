import React from 'react';
import {Box, Button} from '@mui/material';

interface OpenerCardProps {
    setShowAll: (b: boolean) => void
}

const OpenerTile = ({setShowAll}: OpenerCardProps) => {

    return (<Box
        sx={{
            minWidth: 250,
            boxSizing: "border-box",
            flexShrink: 0,
            p: 1,
            borderRadius: 2,
            border: '1px solid lightgray',
        }}
    >
        <Button onClick={() => setShowAll(true)}>Show more relatives</Button>
    </Box>);
};

export default OpenerTile;