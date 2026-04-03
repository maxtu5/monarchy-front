import React, {ReactNode, useRef} from "react";
import {Box, IconButton, Typography} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {Flags} from "./Flags";

function Stripe(props: { country: string, exists: boolean }) {
    function getStripeColor(input: string): string {
        let hash = 0;

        for (let i = 0; i < input.length; i++) {
            hash = (hash * 31 + input.charCodeAt(i)) | 0;
        }

        const hue = Math.abs(hash) % 360;
        const saturation = 65;
        const lightness = 45;

        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    return (
        <Box
            sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: getStripeColor(props.country),
                minWidth: "100%",     // matches tile width
                opacity: props.exists ? 1 : 0.1
            }}
            title={props.country}
        />
    );
}

export type ScrollItemProps = {
    tile: ReactNode;
    stripes?: string[];
};

export function ScrollItem(props: ScrollItemProps) {
    return null;
}

export function ScrollContainer(props: { children: ReactNode, stripesMap?: Map<string, string[]> }) {
    const scrollRef = useRef<HTMLDivElement | null>(null);

    const items = React.Children.toArray(props.children)
        .map(child => (child as any).props as { tile: ReactNode; stripes?: string[] });

    const scroll = (offset: number) => {
        scrollRef.current?.scrollBy({left: offset, behavior: "smooth"});
    };

    return (
        <Box sx={{width: "100%", position: "relative", overflow: "hidden", my: 1}}>

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
                    overflowX: "auto",
                    scrollBehavior: "smooth",
                    px: 8,
                    mr: 8,
                    "&::-webkit-scrollbar": {display: "none"}
                }}
            >

                <Box sx={{display: "flex", gap: 2}}>
                    {items.map((i, idx) => (
                        <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>

                            {/* Tiles row */}
                            <Box sx={{display: "flex", gap: 2}}>
                                {items.map((i, idx) => (
                                    <Box key={idx} sx={{width: 250}}>
                                        {i.tile}
                                    </Box>
                                ))}
                            </Box>

                            {/* Stripe rows */}
                            <Box sx={{display: "flex", gap: 4, flexDirection: "column"}}>
                                {Array.from(props.stripesMap?.keys() || []).map(country => (
                                    <Box key={country} sx={{ display: "flex", gap: 2}}>

                                        {items.map((i, idx) => (
                                            <Box key={idx} sx={{position: 'relative',width: 250}}>
                                                {i.stripes?.includes(country) && <Box sx={{position: 'absolute', left: 1, top: 0}}>
                                                    <Flags countries={[country]}/>
                                                </Box>}
                                                <Stripe
                                                    country={country}
                                                    exists={i.stripes?.includes(country) ?? false}
                                                />
                                            </Box>
                                        ))}
                                    </Box>
                                ))}
                            </Box>

                        </Box>
                    ))}
                </Box>
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





