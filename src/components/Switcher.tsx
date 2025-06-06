import React, {useEffect, useState} from 'react';
import {Box, Stack, Tab, Tabs} from "@mui/material";
import {Monarch, ThroneCardData, ThroneDetails} from "../utils/types";
import ThronesArea from "./ThronesArea";
import PeopleArea from "./PeopleArea";
import {base_url, path_graphql_query, request_graphql_thrones} from "../utils/constants";
import {KingdomContext} from '../utils/context';
import ThroneDetailsCard from "./ThroneDetailsCard";

function Switcher() {
    const [thrones, setThrones] = useState<ThroneCardData[]>([]);
    const [monarch, setMonarch] = useState<Monarch | null>(null)
    const [mode, setMode] = useState(0);

    const [selectedThrone, setSelectedThrone] = useState<ThroneDetails | null>(null)

    useEffect(() => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: request_graphql_thrones
            })
        };
        fetch(`${base_url}${path_graphql_query}`, options)// 'http://localhost:8080/data/thrones/', options) //
            .then(response => {
                // if (response.status === 200) {
                return response.json();
                // } else {
                //     throw new Error(response.status.toString());
                // }
            })
            .then(data => {
                setThrones(data.data.thrones.map((t: any) => handleApiData(t)));
            });
    }, [])

    function handleApiData(data: any): ThroneCardData {
        return {
            country: data.country,
            id: data.id,
            name: data.name,
            flagUrl: data.flagUrl,
            years: data.props.years,
            monarchs: data.reignscount,
            lastMonarch: {
                reign: {
                    id: data.props.lastMonarch.reign.id,
                    title: data.props.lastMonarch.reign.title,
                    country: data.props.lastMonarch.reign.country,
                    start: data.props.lastMonarch.reign.start,
                    end: data.props.lastMonarch.reign.end,
                    coronation: data.props.lastMonarch.reign.coronation,
                    successor: null,
                    predecessor: null
                },
                monarch: {
                    id: data.props.lastMonarch.monarch.id,
                    name: data.props.lastMonarch.monarch.name,
                    birth: data.props.lastMonarch.monarch.birth,
                    death: data.props.lastMonarch.monarch.death,
                    url: data.props.lastMonarch.monarch.url,
                    gender: data.props.lastMonarch.monarch.gender,
                    status: data.props.lastMonarch.monarch.status,
                    imageUrl: data.props.lastMonarch.monarch.imageUrl,
                    imageCaption: data.props.lastMonarch.monarch.imageCaption,
                    reigns: [],
                    father: null,
                    mother: null,
                    children: []
                }
            }
        }
    }

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setMode(newValue);
    }

    interface TabPanelProps {
        children?: React.ReactNode;
        index: number;
        value: number;
    }

    function TabPanel(props: TabPanelProps) {
        const {children, value, index, ...other} = props;

        return (
            <Box
                role="tabpanel"
                hidden={value !== index}
                id={`vertical-tabpanel-${index}`}
                aria-labelledby={`vertical-tab-${index}`}
                sx={{width: '75%'}}
                {...other}
            >
                {value === index && <Box>{children}</Box>
                }
            </Box>
        );
    }

    return (
        <KingdomContext.Provider value={{
            thrones: thrones,
            monarch: monarch,
            selectedThrone: selectedThrone,
            setSelectedThrone: setSelectedThrone,
            setMonarch: setMonarch,
            setMode: setMode
        }}>

            <Stack direction="row" spacing={2} justifyContent={"space-between"}>

                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={mode}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    sx={{borderRight: 1, borderColor: 'divider', width: '25%'}}
                >
                    <Tab label="All Thrones" {...{
                        id: `vertical-tab-0`,
                        'aria-controls': `vertical-tabpanel-0`,
                    }} />
                    <Tab label="Throne" {...{
                        id: `vertical-tab-1`,
                        'aria-controls': `vertical-tabpanel-1`,
                    }} />
                    <Tab label="People" {...{
                        id: `vertical-tab-2`,
                        'aria-controls': `vertical-tabpanel-2`,
                    }}  />

                </Tabs>
                <TabPanel value={mode} index={0}>
                    <ThronesArea setMode={setMode}/>
                </TabPanel>
                <TabPanel value={mode} index={1}>
                    <ThroneDetailsCard
                        selectedThrone={selectedThrone}
                        setMode={setMode}
                    />
                </TabPanel>
                <TabPanel value={mode} index={2}>
                    <PeopleArea/>
                </TabPanel>
            </Stack>
        </KingdomContext.Provider>
    );
}

export default Switcher;