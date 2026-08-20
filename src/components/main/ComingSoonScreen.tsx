import {Box} from "@mui/material";
import {useEffect} from "react";

export function ComingSoonScreen() {
    useEffect(() => {
        document.title = "Coming soon";
    }, []);
    return (<Box>
        coming soon
    </Box>);}