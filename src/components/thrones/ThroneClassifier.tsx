import React, {useContext, useMemo, useState} from "react";
import {KingdomContext} from "../../utils/context";
import {Box, List, ListItemButton, Typography} from "@mui/material";
import GenericTile from "../shared/GenericTile";
import {ThroneCardData} from "../../utils/types";

const CATEGORY_DEFINITIONS = [
    { label: "All", filter: (t:ThroneCardData) => true },
    { label: "Existing", filter: (t:ThroneCardData) => t.years.endsWith('now') },
    // { label: "Ancient", filter: t => t.status === "ancient" },
    // { label: "Western Europe", filter: t => t.region === "western-europe" },
    // { label: "Eastern Europe", filter: t => t.region === "eastern-europe" },
    // { label: "Germany", filter: t => t.country === "GERMANY" },
    // { label: "Mediterranean", filter: t => t.region === "mediterranian" },
    // { label: "Scandinavia", filter: t => t.region === "scandinavia" }
];

export function ThroneClassifier() {
    const {allThrones,} = useContext(KingdomContext)
    const [selected, setSelected] = useState("All");

    // Build categories with automatic counts
    const categories = useMemo(() => {
        return CATEGORY_DEFINITIONS.map(cat => ({
            label: cat.label,
            count: allThrones.filter(cat.filter).length,
            filter: cat.filter
        }));
    }, [allThrones]);

    // Filter thrones based on selected category
    const filteredThrones = useMemo(() => {
        const cat = categories.find(c => c.label === selected);
        return cat ? allThrones.filter(cat.filter) : allThrones;
    }, [selected, categories, allThrones]);

    return (
        <Box sx={{display: "flex", width: "100%", minHeight: "100%"}}>

            <Box
                sx={{
                    width: "20%",
                    borderRight: "1px solid #ccc",
                    p: 2,
                    boxSizing: "border-box"
                }}
            >
                <List>
                    {categories.map(cat => (
                        <ListItemButton
                            key={cat.label}
                            selected={selected === cat.label}
                            onClick={() => setSelected(cat.label)}
                            sx={{borderRadius: 1, mb: 1}}
                        >
                            <Typography>
                                {cat.label} ({cat.count})
                            </Typography>
                        </ListItemButton>
                    ))}
                </List>
            </Box>

            {/* RIGHT COLUMN */}
            <Box
                sx={{
                    width: "80%",
                    p: 2,
                    boxSizing: "border-box",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2
                }}
            >
                {filteredThrones.map(throne => (
                    <GenericTile
                        key={throne.id}
                        width="32%"
                        displayedThrone={throne}
                    />
                ))}
            </Box>
        </Box>
    );
}