import React, {useContext, useEffect, useState} from 'react';
import {Box, Grid2, IconButton, Stack, Typography} from "@mui/material";
import Infobox from "./Infobox";
import FamilyCard from "./Family/FamilyCard";
import ReignCard from "./Reign/ReignCard";
import {KingdomContext} from "../../utils/context";
import {second_url} from "../../utils/constants";
import {SameTimeRulers} from "./Reign/SameTimeRulers";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {compareDates, mergeTwoDates} from "../../utils/functions";
import {Reign} from "../../utils/types";

function StyledOpener(props: { onClick: () => void, label: string }) {
    return (
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}
             sx={{flex: 1, minWidth: '120px'}}
        >
            <Typography variant="caption" noWrap>{props.label}</Typography>
            <IconButton
                size="small"
                onClick={props.onClick}
            >
                <ArrowForwardIosIcon fontSize="small"/>
            </IconButton>
        </Box>
    );
}

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

function MonarchPanel() {
    const {monarch} = useContext(KingdomContext)
    const [desc, setDesc] = useState<string>("");
    const [showSameTimers, setShowSameTimers] = useState(false)
    const [reignSpan, setReignSpan] = useState<Date[]>([])

    useEffect(() => {
        setShowSameTimers(false)
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

    return (
        <Grid2
            container
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                m: 1
            }}
        >
            <Grid2 size={12}>
                <Typography variant="h5" component="div">
                    {monarch?.name}
                </Typography>
            </Grid2>

            <Grid2 size={{xs: 12, sm: 3}}>
                <Stack>
                    <Infobox/>
                    <StyledOpener
                        onClick={()=>setShowSameTimers(!showSameTimers)}
                        label={`Monarchs ruled in the same time ${reignSpan.length===0?'': mergeTwoDates(reignSpan[0], reignSpan[1])}`}/>
                    {showSameTimers && <SameTimeRulers span={reignSpan}/>}
                </Stack>
            </Grid2>
            <Grid2 size={{xs: 12, sm: 8}}>
                <Stack>
                    <Typography m={1} variant={"body2"}>
                        {monarch?.description == "" ? desc : monarch?.description}
                    </Typography>

                    <ReignCard/>
                    <FamilyCard/>
                </Stack>
            </Grid2>


        </Grid2>
    );
}

export default MonarchPanel;