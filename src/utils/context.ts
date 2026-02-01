import React from "react";
import {ContextData, Monarch, ThroneCardData, ThroneDetails} from "./types";

const thrones: Array<ThroneCardData> = []

const monarch: Monarch | null = null

export const KingdomContext = React.createContext<ContextData>(
    {
        allThrones: thrones,
        monarch: monarch,
        throne: null,
        setThrone: (throne: ThroneDetails | null)=>{},
        setMonarch: function (m: Monarch | null): void {}
    })

export const ModeContext = React.createContext<{
    mode: number,
    setMode: (i: number)=>void}>
({mode:0, setMode:(i: number)=>{}})