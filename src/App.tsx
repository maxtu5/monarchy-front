import React, {useEffect, useMemo, useState} from 'react';
import './App.css';
import {KingdomContext, ModeContext} from "./utils/context";
import {Monarch, Throne, ThronePlus} from "./utils/types";
import AppRouter from "./components/main/AppRouter";
import {BrowserRouter} from "react-router-dom";
import {fetchAllThrones} from "./fetchers/fetchersThrones";

const sortThrones = (a: Throne, b: Throne): number => {
    const aHasNow = a.years.toLowerCase().includes('now');
    const bHasNow = b.years.toLowerCase().includes('now');
    const getStartYear = (years: string): number => {
        const match = years.match(/^(\d{1,4})/);
        return match ? parseInt(match[1], 10) : Infinity;
    };
    const getEndYear = (years: string): number => {
        const match = years.match(/(\d{1,4})$/);
        return match ? parseInt(match[1], 10) : -Infinity;
    };
    if (aHasNow && !bHasNow) return -1;
    if (!aHasNow && bHasNow) return 1;
    if (aHasNow && bHasNow) {
        return getStartYear(a.years) - getStartYear(b.years); // earlier start year first
    }
    return getEndYear(b.years) - getEndYear(a.years);
}

function App() {
    const [mode, setMode] = useState(0);
    const [thrones, setThrones] = useState<Throne[]>([]);
    const [monarch, setMonarch] = useState<Monarch | null>(null)

    useEffect(() => {
        fetchAllThrones().then((thrones: Throne[]) => {
            setThrones(thrones.sort(sortThrones));
        });
    }, [])

    const contextValue = useMemo(() => ({
        allThrones: thrones,
        monarch: monarch,
        setMonarch: setMonarch
    }), [thrones, monarch]);

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