import React from "react";
import {ContextData, Monarch, Throne, ThronePlus} from "./types";

const thrones: Array<Throne> = []

const monarch: Monarch | null = null

export const KingdomContext = React.createContext<ContextData>(
    {
        allThrones: thrones,
        monarch: monarch,
        setMonarch: function (m: Monarch | null): void {}
    })