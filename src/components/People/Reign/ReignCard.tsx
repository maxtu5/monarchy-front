import React, {useContext} from 'react';
import {Avatar, Box, Button, Card, CardContent, Link, Stack, Tooltip, Typography} from "@mui/material";

import {KingdomContext, ModeContext} from "../../../utils/context";
import {compareDates, lifeTime, mergeTwoDates} from "../../../utils/functions";
import DisplayName from "../DisplayName";
import {GroupedReign, Reign} from "../../../utils/types";
import PersonTile from "../Family/PersonTile";
import displayName from "../DisplayName";
import {loadMonarch} from "../../../fetchers/fetchers";

function Xseccor(props: { onClick: () => void, displayName: string | undefined, label: string }) {
    return (
        <Typography variant="body2" component="div">
            {props.label+' '}
            <Link sx={{cursor: 'pointer', textDecoration: 'underline'}} onClick={props.onClick}>
                {props.displayName}
            </Link>
        </Typography>
    );
}

function ReignCard() {
    const {monarch, setMonarch, allThrones} = useContext(KingdomContext)
    const {setMode} = useContext(ModeContext)

    async function reloadMonarch(id: string) {
        if (!monarch) return;
        const newMonarch = await loadMonarch(id);
        if (newMonarch) {
            setMonarch(newMonarch);
            setMode(2);
        }
    };

    function groupReigns(reigns: Reign[]): { countries: string[]; reigns: Reign[] }[] {
        const groupedMap: { countries: string[], reigns: Reign[] }[] = []
        const grouped: GroupedReign[] = []
        reigns.forEach(reign => {
            const index = grouped.findIndex(r => r.start?.getDay() === reign.start?.getDay() && r.end?.getDay() === reign.end?.getDay()
                && r.predecessor?.id === reign.predecessor?.id && r.successor?.id === reign.successor?.id
            );
            if (index === -1) {
                grouped.push({...reign, countries: [reign.country]});
            } else {
                grouped[index].countries = [...grouped[index].countries, reign.country];
                grouped[index].title = grouped[index].title.includes(reign.title) ? grouped[index].title : grouped[index].title + ', ' + reign.title;
            }
        })

        const gsorted = grouped.sort((a, b) => {
            return a.countries.length === b.countries.length ?
                (a.country === b.country ? compareDates(a.start, b.start) : a.country.localeCompare(b.country)) :
                a.countries.length - b.countries.length
        })

        gsorted.forEach(reign => {
            const rightIndex = groupedMap.findIndex(rg => JSON.stringify(rg.countries) === JSON.stringify(reign.countries))
            if (rightIndex !== -1) {
                groupedMap[rightIndex].reigns.push(reign as Reign)
            } else {
                groupedMap.push({countries: [...reign.countries], reigns: [reign as Reign]})
            }
        })
        return groupedMap;
    }

    function Flags(props: { countries: string[] }) {
        return (<Stack direction={'row'} spacing={1}>{props.countries.map(country => (
            <Tooltip key={country} title={country}>
                <Avatar sx={{width: 24, height: 24}}
                        src={allThrones.find(t => t.country === country)?.flagUrl}/>
            </Tooltip>
        ))}</Stack>);
    }

    function Reigns(props: { reigns: Reign[] }) {
        return (
            <Stack>
                {props.reigns.map(((reign, index) => (
                    <span>
                    <Typography variant="h6" component="div">
                        {reign.title + ', ' + mergeTwoDates(reign.start, reign.end) + lifeTime(reign.start, reign.end)}<br/>
                    </Typography>

                    <Stack direction={"row"} spacing={2}>
                        {reign.predecessor === null ? '' :
                            <Stack>
                                {monarch?.id === reign.predecessor?.id ?
                                    <Stack>
                                        <Typography
                                            sx={{color: 'text.secondary'}}>Predecessor</Typography>
                                        <Typography>{`Himself as ${props.reigns[index - 1].title}`}</Typography>
                                    </Stack> :
                                    <DisplayName monarch={reign.predecessor} type={'Predecessor'}
                                                 displayCrown={false}/>
                                }
                                <Typography variant="body2" component="div">
                                    {mergeTwoDates(reign.predecessor.reigns[0].start, reign.predecessor.reigns[0].end)}
                                </Typography>
                            </Stack>
                        }

                        {reign.successor === null ? '' :
                            <Stack>
                                {monarch?.id === reign.successor?.id ?
                                    <Stack>
                                        <Typography
                                            sx={{color: 'text.secondary'}}>Successor</Typography>
                                        <Typography>{`Himself as ${props.reigns[index + 1].title}`}</Typography>
                                    </Stack> :
                                    <DisplayName monarch={reign.successor} type={'Successor'}
                                                 displayCrown={false}/>
                                }
                                <Typography variant="body2" component="div">
                                    {mergeTwoDates(reign.successor.reigns[0].start, reign.successor.reigns[0].end)}
                                </Typography>
                            </Stack>
                        }

                    </Stack>
                    </span>
                )))}

            </Stack>
        );
    }

    return (
        <Box sx={{
            p: 1,
            borderRadius: 2,
            border: '1px solid lightgray',
            display: monarch?.reigns && monarch.reigns.length > 0 ? 'flex' : 'none',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 1,
            bgcolor: 'background.paper',
        }}>

            {monarch?.reigns && (monarch?.reigns?.length > 1 ?
                groupReigns(monarch?.reigns || []).map((reignGroup) =>
                    <PersonTile width={'30%'}>
                        <Stack direction={'row'} spacing={1}>
                            <Flags countries={reignGroup.countries}/>
                            <Typography variant={'body2'}
                                        sx={{color: 'text.secondary'}}>{reignGroup.countries}</Typography>
                        </Stack>

                        {reignGroup.reigns.map((reign, index) =>
                            <>
                            <Typography variant="body2" component="div">
                                {reign.title}
                            </Typography>
                            <Typography variant="body2" component="div">
                                {mergeTwoDates(reign.start, reign.end) + lifeTime(reign.start, reign.end)}
                            </Typography>
                            {reign.predecessor &&
                                <Xseccor
                                    label={monarch?.id === reign.predecessor?.id ? 'Predecessor: Himself':'Predecessor'}
                                    onClick={()=> {
                                        if (reign.predecessor) reloadMonarch(reign.predecessor.id)
                                    }}
                                    displayName={monarch?.id === reign.predecessor?.id ? undefined : reign.predecessor?.name}/>
                            }


                        <Typography variant="body2" component="div">
                            Successor
                        </Typography>
                    </>)}
        </PersonTile>)
:
    groupReigns(monarch?.reigns || [])
        .map(reignsGroup => (
            <Stack direction={"row"} spacing={2}>
                <Flags countries={reignsGroup.countries}/>
                <Reigns reigns={reignsGroup.reigns}/>
            </Stack>
        ))
)
}
</Box>
)
    ;
}

export default ReignCard;