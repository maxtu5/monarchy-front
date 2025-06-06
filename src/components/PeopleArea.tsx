import React, {useContext, useEffect, useState} from 'react';
import ChooseMonarch from "./ChooseMonarch";
import MonarchPanel from './People/MonarchPanel';
import {KingdomContext} from "../utils/context";


function PeopleArea() {
    const {monarch} = useContext(KingdomContext)
    return (
        <div>
            { monarch === null &&
                <ChooseMonarch/>
            }
            { monarch !== null &&
                <MonarchPanel/>
            }
        </div>
    );
}

export default PeopleArea;