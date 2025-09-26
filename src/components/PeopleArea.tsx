import React, {useContext, useEffect, useState} from 'react';
import ChooseMonarch from "./ChooseMonarch";
import MonarchPanel from './People/MonarchPanel';
import {KingdomContext, ModeContext} from "../utils/context";


function PeopleArea() {
    const {setMode} = useContext(ModeContext)
    const {monarch} = useContext(KingdomContext)
    if (monarch===null) setMode(3)
    return (<MonarchPanel/>);
}

export default PeopleArea;