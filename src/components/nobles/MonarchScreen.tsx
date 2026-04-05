import React, {useContext, useEffect, useState} from 'react';
import {Box, CircularProgress, IconButton, Stack, Typography} from "@mui/material";
import Infobox from "./Infobox";
import FamilyCard from "./family/FamilyCard";
import ReignCard from "./reigns/ReignCard";
import {KingdomContext} from "../../utils/context";
import {second_url} from "../../utils/constants";
import {SameTimeRulers} from "./reigns/SameTimeRulers";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {compareDates} from "../../utils/functions";
import {Reign} from "../../utils/types";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {useParams} from "react-router-dom";
import {fetchMonarch} from "../../fetchers/fetchersMonarchs";
import {useDetectScreen} from "../../utils/useDetectScreen";

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
    const {monarch, setMonarch} = useContext(KingdomContext)
    const [desc, setDesc] = useState<string>("");
    const [showSameTimers, setShowSameTimers] = useState(false)
    const [reignSpan, setReignSpan] = useState<Date[]>([])
    const {id} = useParams();
    const screen = useDetectScreen();

    useEffect(() => {
        console.log(id)
        if (!id) return
        const load = async () => {
            try {
                const m = await fetchMonarch(id);
                console.log(m)
                setMonarch(m);
            } catch (err) {
                console.error("Failed to load monarch", err);
            }
        };
        load();
        return ()=>setMonarch(null);
    }, [id]);

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
            <Box display="flex" justifyContent="space-between" alignItems="center"
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

    return (!monarch ? <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
        width: '100%'
    }}>
        <CircularProgress />
    </Box>
:
    <Box sx={{
        display: 'flex',
        flexDirection: screen === 'mobile_vertical' ? 'column' : 'row'
    }}>
        {/* Left column: 20% width */}
        <Box sx={{display: screen === 'mobile_vertical' ? 'none' : 'block', width: '20%',  mx: 1, mt: 1}}>
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
            <Box sx={{ width: 'mobile_vertical' ? 'auto' : '80%', mx: 1, overflowY: 'auto' , mt: 1}}>
                <Typography variant="h5">{monarch?.name || 'Unnamed Monarch'}</Typography>
                <Typography variant="body2" sx={{ my: 2, whiteSpace: "pre-wrap" }}>
                    {monarch?.description === '' ? desc : monarch?.description}
                </Typography>
                <Stack spacing={2}>
                    {screen === 'mobile_vertical' && <Infobox/>}
                    <ReignCard />
                    <FamilyCard />
                    {screen === 'mobile_vertical' && <StyledOpener
                        onClick={() => setShowSameTimers(!showSameTimers)}
                        label={`Monarchs of the time`}
                    />}
                    {screen === 'mobile_vertical' && showSameTimers && <SameTimeRulers span={reignSpan} />}
                </Stack>
            </Box>
        </Box>
    );
}

export default MonarchScreen;