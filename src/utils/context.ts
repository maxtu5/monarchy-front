import React from "react";
import {ContextData, Monarch, ThroneCardData, ThroneDetails} from "./types";
import ThroneDetailsCard from "../components/ThroneDetailsCard";

const thrones: Array<ThroneCardData> = []

const monarch: Monarch | null = null

export const KingdomContext = React.createContext<ContextData>(
    {
        thrones: thrones,
        monarch: monarch,
        selectedThrone: null,
        setSelectedThrone: (throne: ThroneDetails | null)=>{},
        setMonarch: function (m: Monarch | null): void {},
            setMode: (n: number)=>{}
    })