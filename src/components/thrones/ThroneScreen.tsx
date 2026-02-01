import React, {useContext, useEffect} from 'react';
import {Avatar, Box, Tooltip, Typography} from "@mui/material";
import {KingdomContext} from "../../utils/context";
import GenericTile from "../shared/GenericTile";
import DisplayName from "../shared/DisplayName";
import {fetchThroneDetails, fetchThroneDetailsA} from "../../fetchers/fetchers";
import {useParams} from "react-router-dom";
import {ScrollContainer} from "../shared/ScrollContainer";

function Header() {
    const {throne, allThrones} = useContext(KingdomContext)

    return (
        <Box sx={{ display:'flex', m: 1, p: 1, gap: 2, bgcolor: "#ddd" }}>
            <Tooltip key={throne?.country} title={throne?.country}>
                <Avatar src={allThrones.find(t => t.country === throne?.country)?.flagUrl}/>
            </Tooltip>
            <Typography variant={'h6'}>
                {throne?.name}
            </Typography>
        </Box>

    );
}

function MonarchSelector() {
    const {throne} = useContext(KingdomContext)

    return (
        <Box sx={{  m: 1, bgcolor: "#ddd" }}>
            <ScrollContainer>
                {throne?.restMonarchs.map(item =>
                    <GenericTile width={'24%'} displayedMonarch={item.monarch}>
                        <DisplayName monarch={item.monarch} type={item.reign.title} displayCrown={false}/>
                    </GenericTile>)}
            </ScrollContainer>
        </Box>
        );
}

function ThroneScreen() {
    const {setThrone} = useContext(KingdomContext)
    const {country} = useParams();

    useEffect(() => {
        if (!country) return;

        const load = async () => {
            try {
                const td = await fetchThroneDetailsA(country.toUpperCase());
                setThrone(td);
            } catch (err) {
                console.error("Failed to load throne details", err);
            }
        };

        load();
    }, [country]);

    return (
        <>
            <Header/>
            <MonarchSelector/>
        </>
    )
}

export default ThroneScreen;