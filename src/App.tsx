import React, {useEffect, useMemo, useState} from 'react';
import './App.css';
import {Box, Stack} from "@mui/material";
import NavBar from "./components/NavBar";
import {KingdomContext, ModeContext} from "./utils/context";
import ThronesArea from "./components/ThronesArea";
import ThroneDetailsCard from "./components/ThroneDetailsCard";
import PeopleArea from "./components/PeopleArea";
import SearchBar from "./components/Search/SearchBar";
import {Monarch, ThroneCardData, ThroneDetails} from "./utils/types";
import {loadAllThrones} from "./fetchers/MonarchFetcher";

function App() {
    const [mode, setMode] = useState(0);
    const [thrones, setThrones] = useState<ThroneCardData[]>([]);
    const [monarch, setMonarch] = useState<Monarch | null>(null)
    const [throne, setThrone] = useState<ThroneDetails | null>(null)

    useEffect(() => {
        loadAllThrones().then(thrones => {
            setThrones(thrones);
        });
    }, [])

    const allModes = [
        {label: "All Thrones", component: <ThronesArea/>},
        {label: "Throne", component: <ThroneDetailsCard/>},
        {label: "People", component: <PeopleArea/>},
        {label: "Search", component: <SearchBar/>},
    ];

    const contextValue = useMemo(() => ({
        allThrones: thrones,
        throne: throne,
        setThrone: setThrone,
        monarch: monarch,
        setMonarch: setMonarch
    }), [thrones, monarch, throne]);

    return (
        <ModeContext.Provider value={{mode: mode, setMode: setMode, allModes}}>
            <KingdomContext.Provider value={contextValue}>

                <Box>
                    <NavBar/>
                    {allModes[mode].component}
                </Box>

            </KingdomContext.Provider>
        </ModeContext.Provider>
    );
}

export default App;