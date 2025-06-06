import {Monarch} from "../../../utils/types";
import {Box} from "@mui/material";
import React from "react";
import {SameTimeRulers} from "./SameTimeRulers";
import {RelativeRulers} from "./RelativeRulers";

export function ExtraReignsPanel(props: { mode: number, monarch: Monarch | null }) {
    return (<Box>
        {props.mode === 1 ? (<SameTimeRulers monarch={props.monarch}/>) :
            (props.mode === 2 ? (<RelativeRulers monarch={props.monarch}/>) : <span></span>)}
    </Box>)
}




