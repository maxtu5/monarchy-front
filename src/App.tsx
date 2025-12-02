import React, {useEffect, useMemo, useState} from 'react';
import './App.css';
import {Box} from "@mui/material";
import NavBar from "./components/NavBar";
import {KingdomContext, ModeContext} from "./utils/context";
import AllThronesScreen from "./components/AllThronesScreen";
import SearchBar from "./components/Search/SearchBar";
import {Monarch, ThroneCardData, ThroneDetails} from "./utils/types";
import {fetchAllThrones} from "./fetchers/fetchers";
import MonarchScreen from "./components/MonarchScreen";

function App() {
    const [mode, setMode] = useState(0);
    const [thrones, setThrones] = useState<ThroneCardData[]>([]);
    const [monarch, setMonarch] = useState<Monarch | null>(null)
    const [throne, setThrone] = useState<ThroneDetails | null>(null)

    useEffect(() => {
        fetchAllThrones().then(thrones => {
            setThrones(thrones);
        });
    }, [])

    const allModes = [
        {label: "Thrones", component: <AllThronesScreen/>},
        {label: "People", component: <MonarchScreen/>},
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