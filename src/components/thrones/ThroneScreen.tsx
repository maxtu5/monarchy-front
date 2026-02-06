import React, {useContext, useEffect} from 'react';
import {Avatar, Box, Tooltip, Typography} from "@mui/material";
import {KingdomContext} from "../../utils/context";
import GenericTile from "../shared/GenericTile";
import DisplayName from "../shared/DisplayName";
import {useParams} from "react-router-dom";
import {ScrollContainer} from "../shared/ScrollContainer";
import {ThroneDetails} from "./ThroneDetails";
import {fetchThroneDetails} from "../../fetchers/fetchersThrones";

function Header() {
    const { throne } = useContext(KingdomContext);

    return (
        <Box
            sx={{
                m: 1,
                p: 2,
                bgcolor: "#ddd",
                borderRadius: 1,
                display: "grid",
                gridTemplateRows: "auto auto",   // 2 rows
                rowGap: 1
            }}
        >
            {/* Row 1 — Flag + Name  */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Tooltip title={throne?.country}>
                    <Avatar src={throne?.flagUrl} />
                </Tooltip>

                <Typography variant="h4" noWrap>
                    {throne?.name}
                </Typography>
            </Box>

            {/* Row 2 — 25% left cell + rest */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "25% 1fr",
                    columnGap: 2,
                    alignItems: "start"
                }}
            >
                {/* Left 25% */}
                <ThroneDetails/>

                {/* Right remaining space */}
                <Typography variant="body1">
                    {throne?.description}
                </Typography>
            </Box>
        </Box>
    );
}

function MonarchSelector() {
    const {throne} = useContext(KingdomContext)
    // console.log(throne?.reigns)
    return (
        <Box sx={{  m: 1, bgcolor: "#ddd" }}>
            <ScrollContainer>
                {throne?.reigns.map(item =>
                    <GenericTile width={'24%'}
                                 displayedMonarch={item.monarch===null ? undefined : item.monarch}
                    displayedReign={item}>
                        <DisplayName monarch={item.monarch} type={item.title} displayCrown={false}/>
                    </GenericTile>)}
            </ScrollContainer>
        </Box>
        );
}

function ThroneScreen() {
    const {allThrones,setThrone} = useContext(KingdomContext)
    const {country} = useParams();

    useEffect(() => {
        if (!country) return;
        // console.log(country)

        const load = async () => {
            try {
                const td = await fetchThroneDetails(country);
                setThrone(td);
            } catch (err) {
                console.error("Failed to load throne details", err);
            }
        };
        load();
        return ()=>setThrone(null)
    }, [country]);

    return (
        <>
            <Header/>
            <MonarchSelector/>
        </>
    )
}

export default ThroneScreen;