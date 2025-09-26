import React, {useContext} from 'react';
import {Avatar, Button, Card, CardContent, Stack, Tooltip, Typography} from "@mui/material";

import {KingdomContext} from "../../../utils/context";
import {compareDates, lifeTime, mergeTwoDates} from "../../../utils/functions";
import DisplayName from "../DisplayName";
import {GroupedReign, Reign} from "../../../utils/types";
import {ExtraReignsPanel} from "./ExtraReignsPanel";

function ReignCard() {
    const [panelSelector, setPanelSelector] = React.useState(0)
    const {monarch, allThrones} = useContext(KingdomContext)

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
        return (<Stack spacing={1}>{props.countries.map(country => (
            <Tooltip key={country} title={country}>
                <Avatar src={allThrones.find(t => t.country === country)?.flagUrl}/>
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
                                        <Typography>{`Himself as ${props.reigns[index-1].title}`}</Typography>
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
                                        <Typography>{`Himself as ${props.reigns[index+1].title}`}</Typography>
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
        <Card variant="outlined"
            // @ts-ignore
              sx={{display: monarch.reigns.length > 0 ? '' : 'none'}}>
            <CardContent>
                {/*<Typography gutterBottom sx={{color: 'text.secondary', fontSize: 14, mb: 1.5}}>*/}
                {/*    Reigns*/}
                {/*</Typography>*/}

                {groupReigns(monarch?.reigns || [])
                    .map(reignsGroup => (
                        <Stack direction={"row"} spacing={2}>
                            <Flags countries={reignsGroup.countries}/>
                            <Reigns reigns={reignsGroup.reigns}/>
                        </Stack>
                    ))
                }

                <Stack direction={'row'} spacing={1} paddingTop={1}>
                    <Button onClick={()=>setPanelSelector(panelSelector===1 ? 0 : 1)}>{(panelSelector===1 ? 'HIDE' : 'SHOW') + ' RULERS OF THE SAME TIME'}</Button>
                    <Button onClick={()=>setPanelSelector(panelSelector===2 ? 0 : 2)}>{(panelSelector===2 ? 'HIDE' : 'SHOW') + ' RELATIVE WHO RULED'}</Button>
                    <Button>SHOW SHORTEST PATHS</Button>
                </Stack>

                {panelSelector===0 ? <span></span> : <ExtraReignsPanel mode={panelSelector} monarch={monarch}/>}

            </CardContent>
        </Card>
    );
}

export default ReignCard;