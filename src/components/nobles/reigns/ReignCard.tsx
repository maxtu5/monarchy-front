import React, {useContext} from 'react';
import {Avatar, Box, Button, Card, CardContent, Link, Stack, Tooltip, Typography} from "@mui/material";

import {KingdomContext, ModeContext} from "../../../utils/context";
import {compareDates, lifeTime, mergeTwoDates} from "../../../utils/functions";
import DisplayName from "../../shared/DisplayName";
import {GroupedReign, Reign} from "../../../utils/types";
import GenericTile from "../../shared/GenericTile";
import {fetchMonarch} from "../../../fetchers/fetchersMonarchs";
import {useNavigate} from "react-router-dom";

function Xseccor(props: { onClick: () => void, displayName: string | undefined, label: string }) {
    return (
        <Typography variant="body2" component="div">
            {props.label + ' '}
            <Link sx={{cursor: 'pointer', textDecoration: 'underline'}} onClick={props.onClick}>
                {props.displayName}
            </Link>
        </Typography>
    );
}

function ReignCard() {
    const {monarch, setMonarch, allThrones} = useContext(KingdomContext)
    const navigate = useNavigate();

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

        ))}
            <Typography variant={'body2'}
                        sx={{color: 'text.secondary'}}>{props.countries.join(', ')}</Typography>
        </Stack>);
    }
    function Reigns(props: { reigns: Reign[] }) {
        return (
            <Stack>
                {props.reigns.map(((reign, index) => (
                    <span key={index}>
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
                                    <DisplayName monarch={reign.predecessor.monarch} type={'Predecessor'}
                                                 displayCrown={false}/>
                                }
                                <Typography variant="body2" component="div">
                                    {mergeTwoDates(
                                        reign.predecessor.monarch===null ? null : reign.predecessor.monarch.reigns[0].start,
                                        reign.predecessor.monarch===null ? null : reign.predecessor.monarch.reigns[0].end)}
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
                                    <DisplayName monarch={reign.successor.monarch} type={'Successor'}
                                                 displayCrown={false}/>
                                }
                                <Typography variant="body2" component="div">
                                    {mergeTwoDates(
                                        reign.successor.monarch===null ? null : reign.successor.monarch.reigns[0].start,
                                        reign.successor.monarch===null ? null : reign.successor.monarch.reigns[0].end)}
                                </Typography>
                            </Stack>
                        }

                    </Stack>
                    </span>
                )))}

            </Stack>
        );
    }
// console.log(monarch)
    return (
        <Box sx={{
            // p: 1,
            borderRadius: 2,
            // border: '1px solid lightgray',
            display: monarch?.reigns && monarch.reigns.length > 0 ? 'flex' : 'none',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 1,
            // bgcolor: 'background.paper',
        }}>

            {monarch?.reigns && (groupReigns(monarch?.reigns || []).map((reignGroup, index) =>
                <GenericTile key={index} width={reignGroup.reigns.length > 1 ? '100%' : '100%'}>
                    {reignGroup.reigns.length > 1 ? <>
                            <Flags countries={reignGroup.countries}/>
                            <Stack direction={'row'} spacing={2}>
                                {reignGroup.reigns.map((reign, index) =>
                                    <Stack>
                                        <Typography variant="body2" component="div">
                                            {reign.title}
                                        </Typography>
                                        <Typography variant="body2" component="div">
                                            {mergeTwoDates(reign.start, reign.end) + lifeTime(reign.start, reign.end)}
                                        </Typography>
                                        {reign?.predecessor?.id && (
                                            <Xseccor
                                                label={'Predecessor: ' +
                                                    (monarch?.id === reign.predecessor.id ? 'Himself' : '')
                                                }
                                                onClick={() => navigate(`/noble/${reign.predecessor?.id}`)}
                                                displayName={
                                                    monarch?.id === reign.predecessor.id
                                                        ? undefined : (reign.predecessor.monarch===null? undefined : reign.predecessor.monarch.name)
                                                }
                                            />
                                        )}

                                        {reign.successor && (
                                            <Xseccor
                                                label={'Successor: ' +
                                                    (monarch?.id === reign.successor.id ? 'Himself' : '')
                                                }
                                                onClick={() => navigate(`/noble/${reign.successor?.id}`)}
                                                displayName={
                                                    monarch?.id === reign.successor?.id
                                                        ? undefined
                                                        : (reign.successor.monarch===null? undefined : reign.successor?.monarch.name)
                                                }
                                            />
                                        )}
                                    </Stack>)}
                            </Stack></> :
                        <>
                            <Flags countries={reignGroup.countries}/>
                            <Reigns reigns={reignGroup.reigns}/>
                        </>
                    }
                </GenericTile>))
            }
        </Box>
    )
}

export default ReignCard;