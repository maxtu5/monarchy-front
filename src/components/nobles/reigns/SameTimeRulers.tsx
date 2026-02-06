import {Monarch, Reign} from "../../../utils/types";
import React, {useContext, useEffect, useState} from "react";
import {KingdomContext} from "../../../utils/context";
import {fetchSameTimers} from "../../../fetchers/fetchersMonarchs";
import {Avatar, Box, Card, CardContent, Divider, Link, Stack, Tooltip, Typography} from "@mui/material";
import DisplayName from "../../shared/DisplayName";
import GenericTile from "../../shared/GenericTile";

export function SameTimeRulers(props: { span: Date[] }) {
    const [sameTimers, setSameTimers] = useState<Monarch[]>([]);
    const {allThrones, setMonarch} = useContext(KingdomContext)

    useEffect(() => {
        if (sameTimers.length === 0)
            fetchSameTimers(
                props.span[0].getFullYear().toString(),
                props.span[1]===null ? new Date().getFullYear().toString() : props.span[1].getFullYear().toString()
            ).then(setSameTimers)

    }, []);

    function groupMonarchsByCountries(monarchs: Monarch[]): { countries: string[]; monarchs: Monarch[] }[] {
        console.log(monarchs)
        const retval: { countries: string[]; monarchs: Monarch[] }[] = [];

        monarchs
            .filter(m => m !== null)
            .forEach((monarch: Monarch) => {
            const countries = monarch.reigns.map(reign => reign.country).filter((value, index, array) => array.indexOf(value) === index)
            const index = retval.findIndex(r => JSON.stringify(r.countries) === JSON.stringify(countries))
            // console.log(retval, index)
            if (index === -1) {
                retval.push({countries: countries, monarchs: [monarch]})
            } else {
                retval[index].monarchs = [...retval[index].monarchs, monarch]
            }
        })
        return retval;
    }
    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    bgcolor: 'background.paper',
                }}>

                {sameTimers.map(monarch=>
                        <GenericTile
                            width={'100%'}
                            displayedMonarch={monarch}
                        >
                            <DisplayName monarch={monarch} type={monarch.reigns.map(r=>r.country).join(', ')} displayCrown={false}/>

                        </GenericTile>)
                }
            </Box>
        </Box>
    );
}