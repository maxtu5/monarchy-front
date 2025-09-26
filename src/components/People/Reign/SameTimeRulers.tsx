import {Monarch, Reign} from "../../../utils/types";
import React, {useContext, useEffect, useState} from "react";
import {KingdomContext} from "../../../utils/context";
import {compareDates, mergeTwoDates} from "../../../utils/functions";
import {loadMonarch, loadSameTimers} from "../../../fetchers/MonarchFetcher";
import {Avatar, Box, Card, CardContent, Divider, Link, Stack, Tooltip, Typography} from "@mui/material";

export function SameTimeRulers(props: { monarch: Monarch | null }) {
    const [sameTimers, setSameTimers] = useState<Monarch[]>([]);
    const {allThrones, setMonarch} = useContext(KingdomContext)
    const reignSpan: Date[] = calcDateSpan(props.monarch?.reigns);

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

    useEffect(() => {
        if (sameTimers.length === 0) loadSameTimers(props.monarch?.id, reignSpan[0],
            reignSpan[1]===null && reignSpan[0]!==null && reignSpan[0].getFullYear()>(new Date().getFullYear()-150) ? new Date() : reignSpan[1])
            .then(st => setSameTimers(st));
    }, []);

    function groupMonarchsByCountries(monarchs: Monarch[]): { countries: string[]; monarchs: Monarch[] }[] {
        console.log(monarchs)
        const retval: { countries: string[]; monarchs: Monarch[] }[] = [];
        monarchs.filter(m => m !== null).forEach((monarch: Monarch) => {
            const countries = monarch.reigns.map(reign => reign.country).filter((value, index, array) => array.indexOf(value) === index)
            const index = retval.findIndex(r => JSON.stringify(r.countries) === JSON.stringify(countries))
            console.log(retval, index)
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
            <Typography
                variant={'h6'}>{`Monarchs ruled in the same time ${mergeTwoDates(reignSpan[0], reignSpan[1])}`}</Typography>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    bgcolor: 'background.paper',
                }}>

                {groupMonarchsByCountries(sameTimers).map(monarchGroup => (
                    <Card sx={{bgcolor: 'lightgray'}}>
                        <CardContent>
                            <Stack direction={"row"} spacing={2}>
                                <Stack spacing={1}>
                                    {monarchGroup.countries.map(country => (
                                        <Tooltip key={country} title={country}>
                                            <Avatar src={allThrones.find(t => t.country === country)?.flagUrl}/>
                                        </Tooltip>
                                    ))}
                                </Stack>
                                <Stack>
                                    {monarchGroup.monarchs.map(m =>
                                        <Link onClick={async () => {
                                            // @ts-ignore
                                            const retval: Monarch | null = await loadMonarch(m.id);
                                            if (retval !== null) {
                                                setMonarch(retval);
                                            }
                                        }}>
                                            {m.name}
                                        </Link>
                                        )}
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
}