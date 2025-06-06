import React from 'react';
import {Box, List, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import ThronesIcon from '@mui/icons-material/HealthAndSafety';
import MonarchsIcon from '@mui/icons-material/Person4';

function LeftBar() {
    const [selectedIndex, setSelectedIndex] = React.useState(1);

    const handleListItemClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number,
    ) => {
        setSelectedIndex(index);
    };

    return (
        <Box bgcolor={"lightgray"} flex={1} padding={3}>
            <List component="nav" aria-label="main mailbox folders">
                <ListItemButton
                    selected={selectedIndex === 0}
                    onClick={(event) => handleListItemClick(event, 0)}
                >
                    <ListItemIcon>
                        <ThronesIcon />
                    </ListItemIcon>
                    <ListItemText primary="Countries" />
                </ListItemButton>
                <ListItemButton
                    selected={selectedIndex === 1}
                    onClick={(event) => handleListItemClick(event, 1)}
                >
                    <ListItemIcon>
                        <MonarchsIcon />
                    </ListItemIcon>
                    <ListItemText primary="People" />
                </ListItemButton>
            </List>
        </Box>
    );
}

export default LeftBar;