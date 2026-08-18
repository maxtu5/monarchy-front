import React, {ReactNode, useMemo, useRef} from "react";
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

    const items = useMemo(() => {
        return React.Children.toArray(props.children).map(child => {
            const itemProps = (child as any).props as { tile: ReactNode; stripes?: string[] };

            return {
                tile: itemProps.tile,
                // Переводим массив в Set для мгновенного поиска O(1) вместо .includes()
                stripesSet: itemProps.stripes ? new Set(itemProps.stripes) : new Set<string>()
            };
        });
    }, [props.children]);

    const scroll = (offset: number) => {
        scrollRef.current?.scrollBy({left: offset, behavior: "smooth"});
    };

    const connectedCountries = useMemo(() => {
        return Array.from(props.stripesMap?.keys() || []);
    }, [props.stripesMap]);

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
                {/* Единый контейнер для сетки тайлов и страйпов */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "max-content" }}>

                    {/* РЯД 1: Все плитки монархов в одну линию */}
                    <Box sx={{ display: "flex", gap: 2 }}>
                        {items.map((i, idx) => (
                            <Box key={idx} sx={{ width: 250, flexShrink: 0 }}>
                                {i.tile}
                            </Box>
                        ))}
                    </Box>

                    {/* РЯД 2: Страйпы связей под плитками */}
                    {connectedCountries.length > 0 && (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1 }}>
                            {connectedCountries.map(country => {
                                return (
                                    <Box key={country} sx={{ display: "flex", gap: 2 }}>
                                        {items.map((i, idx) => {
                                            // Сверхбыстрая проверка O(1) через Set.has вместо медленного .includes
                                            const hasConnection = i.stripesSet.has(country);

                                            return (
                                                <Box key={idx} sx={{ position: 'relative', width: 250, flexShrink: 0 }}>
                                                    {hasConnection && (
                                                        <Box sx={{ position: 'absolute', left: 4, top: 2, zIndex: 1 }}>
                                                            <Flags countries={[country]} />
                                                        </Box>
                                                    )}
                                                    <Stripe
                                                        country={country}
                                                        exists={hasConnection}
                                                    />
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                );
                            })}
                        </Box>
                    )}

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





