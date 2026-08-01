import {Box, CircularProgress} from "@mui/material";

export function LoadingScreen() {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80vh',
                width: '100%',
            }}
        >
            <CircularProgress />
        </Box>
    );
}