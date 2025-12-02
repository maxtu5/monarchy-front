import React, {useContext, useEffect, useState} from 'react';
import {Box, Grid2, IconButton, Stack, Typography} from "@mui/material";
import Infobox from "./People/Infobox";
import FamilyCard from "./People/Family/FamilyCard";
import ReignCard from "./People/Reign/ReignCard";
import {KingdomContext} from "../utils/context";
import {second_url} from "../utils/constants";
import {SameTimeRulers} from "./People/Reign/SameTimeRulers";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {compareDates, mergeTwoDates} from "../utils/functions";
import {Reign} from "../utils/types";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

function calcDateSpan(reigns: Reign[] | undefined): Date[] {
    const retval: (Date | null)[] = [null, null];
    reigns?.forEach((reign: Reign) => {
        retval[0] = retval[0] === null ? reign.start :
            (compareDates(retval[0], reign.start) <= 0 ? retval[0] : reign.start);
        retval[1] = retval[1] === null ? reign.end :
            (compareDates(retval[1], reign.end) > 0 ? retval[1] : reign.end);
    })
    // @ts-ignore
    return retval;
}

function MonarchScreen() {
    const {monarch} = useContext(KingdomContext)
    const [desc, setDesc] = useState<string>("");
    const [showSameTimers, setShowSameTimers] = useState(false)
    const [reignSpan, setReignSpan] = useState<Date[]>([])

    useEffect(() => {
        setShowSameTimers(false)
        setDesc("")
        setReignSpan(calcDateSpan(monarch?.reigns))
        if (monarch?.description) return
        const request = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }
        // console.log(monarch?.id)
        // console.log(request)

        fetch(`${second_url}/data/monarchs/descbyid/${monarch?.id}`, request)
            .then(response => {
                return response.text();
            })
            .then(data => {
                setDesc(data)
            })
    }, [monarch])

    function StyledOpener(props: { onClick: () => void, label: string }) {
        return (
            <Box display="flex" justifyContent="space-between" alignItems="center" m={2}
                 sx={{flex: 1, minWidth: '120px', p:1,
                     border: '1px solid lightgray',
                 }}
            >
                <Typography noWrap>{props.label}</Typography>
                <IconButton
                    size="small"
                    onClick={props.onClick}
                >
                    {showSameTimers ? (
                        <KeyboardArrowDownIcon fontSize="small" />
                    ) : (
                        <ArrowForwardIosIcon fontSize="small" />
                    )}

                </IconButton>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Left column: 20% width */}
            <Box sx={{ width: '20%', pl: 1, pt:1 }}>
                <Stack spacing={2}>
                    <Infobox />
                    <StyledOpener
                        onClick={() => setShowSameTimers(!showSameTimers)}
                        label={`Monarchs of the time`}
                    />
                    {showSameTimers && <SameTimeRulers span={reignSpan} />}
                </Stack>
            </Box>

            {/* Right column: 80% width */}
            <Box sx={{ width: '80%', overflowY: 'auto', p: 2 }}>
                <Typography variant="h5">{monarch?.name || 'Unnamed Monarch'}</Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                    {monarch?.description === '' ? desc : monarch?.description}
                </Typography>
                <Stack spacing={2} sx={{ mt: 2 }}>
                    <ReignCard />
                    <FamilyCard />
                </Stack>
            </Box>
        </Box>
    );
}

export default MonarchScreen;