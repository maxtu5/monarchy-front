import {ReactNode, useRef} from "react";
import {Box, IconButton} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export function ScrollContainer(props: { children: ReactNode }) {
    const scrollRef = useRef<HTMLDivElement | null>(null);

    const scroll = (offset: number) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: offset,
                behavior: "smooth"
            });
        }
    };

    return (<Box
            sx={{
                width: "100%",
                position: "relative",
                display: 'flex',
                overflow: "hidden",
                my: 1
            }}
        >

            {/* Left arrow */}
            <IconButton
                onClick={() => scroll(-300)}
                sx={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 2,
                    backgroundColor: "rgba(255,255,255,0.7)",
                    "&:hover": {backgroundColor: "rgba(255,255,255,0.9)"}
                }}
            >
                <ArrowBackIosNewIcon/>
            </IconButton>

            {/* Scrollable row */}
            <Box
                ref={scrollRef}
                sx={{
                    display: "flex",
                    minWidth: 0,
                    overflowX: "auto",
                    gap: 2,
                    scrollBehavior: "smooth",
                    px: 8,        // space for left arrow
                    mr: 8,        // space for right arrow

                    "&::-webkit-scrollbar": {display: "none"}
                }}
            >
                {props.children}
            </Box>

            {/* Right arrow */}
            <IconButton
                onClick={() => scroll(300)}
                sx={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 2,
                    backgroundColor: "rgba(255,255,255,0.7)",
                    "&:hover": {backgroundColor: "rgba(255,255,255,0.9)"}
                }}
            >
                <ArrowForwardIosIcon/>
            </IconButton>

        </Box>
    );
}