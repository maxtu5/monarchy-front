import React, {useEffect, useMemo, useState} from 'react';
import './App.css';
import {Box} from "@mui/material";
import NavBar from "./components/main/NavBar";
import {KingdomContext, ModeContext} from "./utils/context";
import {Monarch, ThroneCardData, ThroneDetails} from "./utils/types";
import {fetchAllThrones} from "./fetchers/fetchers";
import AppRouter from "./components/main/AppRouter";
import {BrowserRouter} from "react-router-dom";

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

    const contextValue = useMemo(() => ({
        allThrones: thrones,
        throne: throne,
        setThrone: setThrone,
        monarch: monarch,
        setMonarch: setMonarch
    }), [thrones, monarch, throne]);

    return (
        <BrowserRouter basename={'/monarchy'}>
            <ModeContext.Provider value={{mode: mode, setMode: setMode}}>
                <KingdomContext.Provider value={contextValue}>

                        <AppRouter/>
                </KingdomContext.Provider>
            </ModeContext.Provider>
        </BrowserRouter>
    );
}

export default App;