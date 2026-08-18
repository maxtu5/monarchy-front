import React, {useEffect, useMemo, useState} from 'react';
import {Avatar, Box, Tooltip, Typography} from "@mui/material";
import GenericTile from "../shared/GenericTile";
import DisplayName from "../shared/DisplayName";
import {useParams} from "react-router-dom";
import {ScrollContainer, ScrollItem} from "../shared/ScrollContainer";
import {fetchThroneDetails} from "../../fetchers/fetchersThrones";
import {LoadingScreen} from "../shared/LoadingScreen";
import {ThronePlus} from '../../utils/types';
import {ThroneDetails} from "./ThroneDetails";

interface HeaderProps {
    throne: ThronePlus,
    setThrone: (value: ThronePlus | null) => void,
    displayConnections: boolean,
    setDisplayConnections: (value: boolean) => void,
    connectedThronesMap: Map<string, string[]>
}

function Header({throne, setThrone, displayConnections, setDisplayConnections, connectedThronesMap}: HeaderProps) {
    return (
        <Box
            sx={{
                m: 0,
                p: 2,
                borderRadius: 1,
                display: "grid",
                gridTemplateRows: "auto auto",   // 2 rows
                rowGap: 1
            }}
        >
            {/* Row 1 — Flag + Name  */}
            <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                <Tooltip title={throne.country}>
                    <Avatar src={throne.flagUrl}/>
                </Tooltip>

                <Typography variant="h4" noWrap>
                    {throne.name}
                </Typography>
            </Box>

            {/* Row 2 — 25% left cell + rest */}
            <Box
                sx={{
                    display: "grid",
                    bgcolor: "#ddd",
                    gridTemplateColumns: "30% 1fr",
                    columnGap: 2,
                    alignItems: "start",
                    p: 1
                }}
            >
                {/* Left 25% */}
                <ThroneDetails throne={throne} setThrone={setThrone}
                               displayConnections={displayConnections}
                               setDisplayConnections={setDisplayConnections}
                               connectedThronesMap={connectedThronesMap}
                />

                {/* Right remaining space */}
                <Typography variant="body1">
                    {throne.description}
                </Typography>
            </Box>
        </Box>
    );
}

interface MonarchSelectorProps {
    throne: ThronePlus,
    connectedThronesMap: Map<string, string[]>
}

function MonarchSelector({throne, connectedThronesMap}: MonarchSelectorProps) {
    return (
        <Box sx={{m: 1, bgcolor: "#ddd"}}>
            <ScrollContainer
                stripesMap={connectedThronesMap}>
                {throne.reigns.map(item => (
                    <ScrollItem
                        key={item.id}
                        tile={
                            <GenericTile
                                width="250px"
                                displayedMonarch={item.monarch ?? undefined}
                                displayedReign={item}
                            >
                                <DisplayName
                                    monarch={item.monarch}
                                    type={item.title}
                                    displayCrown={false}
                                />
                            </GenericTile>
                        }
                        stripes={item.monarch?.reigns.map(r => r.country)}
                    />
                )) ?? []}
            </ScrollContainer>
        </Box>
    );
}

function ThroneScreen() {
    const [throne, setThrone] = useState<ThronePlus | null>(null);
    const [displayConnections, setDisplayConnections] = useState(false);
    const {country} = useParams();

    useEffect(() => {
        if (!country) return;

        const load = async () => {
            try {
                const td = await fetchThroneDetails(country);
                setThrone(td);
            } catch (err) {
                console.error("Failed to load throne details", err);
            }
        };
        load();

        return () => {
            setThrone(null);
            setDisplayConnections(false); // Сбрасываем чекбокс при смене страны
        };
    }, [country]);

    const connectedThronesMap = useMemo(() => {
        if (!displayConnections || !throne?.reigns) return new Map<string, string[]>();
        const connections = new Map<string, string[]>();
        const currentCountry = throne.country;
        const reigns = throne.reigns;
        const len = reigns.length;

        for (let i = 0; i < len; i++) {
            const monarch = reigns[i].monarch;
            if (!monarch?.reigns || !monarch.id) continue;

            const monarchReigns = monarch.reigns;
            const mLen = monarchReigns.length;
            const monarchId = monarch.id;

            for (let j = 0; j < mLen; j++) {
                const countryName = monarchReigns[j].country;
                if (countryName === currentCountry) continue;

                const list = connections.get(countryName);
                if (list !== undefined) {
                    list.push(monarchId);
                } else {
                    connections.set(countryName, [monarchId]);
                }
            }
        }
        return connections;
    }, [throne?.reigns, throne?.country, displayConnections]);

    if (!throne) return <LoadingScreen/>;

    return (
        <>
            <Header
                throne={throne}
                setThrone={setThrone}
                displayConnections={displayConnections}
                setDisplayConnections={setDisplayConnections}
                connectedThronesMap={connectedThronesMap}
            />
            <MonarchSelector throne={throne}
                             connectedThronesMap={connectedThronesMap}
            />
        </>
    )
}

export default ThroneScreen;