import {Monarch} from "../../../utils/types";
import React, {useContext, useEffect} from "react";
import {KingdomContext} from "../../../utils/context";
import {loadMonarch, loadSimpleMonarchList} from "../../../fetchers/MonarchFetcher";
import {
    request_graphql_cousins,
    request_graphql_niblings,
    request_graphql_parent_siblings,
    request_graphql_siblings,
    request_graphql_spouses
} from "../../../utils/constants";
import {Avatar, Box, Button, Card, CardContent, Link, Stack, Tooltip, Typography} from "@mui/material";

export function RelativeRulers(props: { monarch: Monarch | null }) {
    const {thrones, setMonarch} = useContext(KingdomContext)
    const [tier, setTier] = React.useState(1);
    const MAX_TIERS = 3;
    const tierCaption = ['', 'I: parents, children', 'II: parents, children, siblings, spouses', 'III plus uncles/aunts, niblings, cousins']
    const [spouses, setSpouses] = React.useState<Monarch[] | null>(null);
    const [siblings, setSiblings] = React.useState<Monarch[] | null>(null);
    const [parentSiblings, setParentSiblings] = React.useState<Monarch[] | null>(null);
    const [niblings, setNiblings] = React.useState<Monarch[] | null>(null);
    const [cousins, setCousins] = React.useState<Monarch[] | null>(null);


    useEffect(() => {
        if (tier > 1 && spouses === null) {
            loadSimpleMonarchList(props.monarch?.id, request_graphql_spouses, 'rel_spouses')
                .then(s => setSpouses(s));
            loadSimpleMonarchList(props.monarch?.id, request_graphql_siblings, 'rel_siblings')
                .then(s => setSiblings(s));

        }
        if (tier > 2 && parentSiblings === null) {
            loadSimpleMonarchList(props.monarch?.id, request_graphql_parent_siblings, 'rel_parent_siblings')
                .then(s => setParentSiblings(s))
            loadSimpleMonarchList(props.monarch?.id, request_graphql_niblings, 'rel_niblings')
                .then(s => setNiblings(s))
            loadSimpleMonarchList(props.monarch?.id, request_graphql_cousins, 'rel_cousins')
                .then(s => setCousins(s))
        }
    }, [tier]);

    function RulingRelativeCard(props: { monarch: Monarch | null, title: string }) {
        return (<Card sx={{bgcolor: 'lightgray'}}>
            <CardContent>
                <Stack direction={"row"} spacing={2}>
                    <Stack spacing={1}>
                        {props.monarch?.reigns.map(r => r.country)
                            .filter((value, index, array) => array.indexOf(value) === index)
                            .map(country => (
                                <Tooltip key={country} title={country}>
                                    <Avatar src={thrones.find(t => t.country === country)?.flagUrl}/>
                                </Tooltip>
                            ))}
                    </Stack>
                    <Stack>
                        <Typography>{props.title}</Typography>
                        <Link onClick={async () => {
                            const retval: Monarch | null = await loadMonarch(props.monarch?.id || null);
                            if (retval !== null) {
                                setMonarch(retval);
                            }
                        }}>
                            {props.monarch?.name}
                        </Link>

                    </Stack>
                </Stack>
            </CardContent>
        </Card>);
    }

    return (<Stack>
        <Stack direction={'row'} spacing={1}>
            <Typography variant={'h6'}>{`TIER ${tierCaption[tier]}`}</Typography>
            <Button onClick={() => {
                if (tier > 0) setTier(tier - 1)
            }}>TIER -</Button>
            <Button onClick={() => {
                if (tier < MAX_TIERS) setTier(tier + 1)
            }}>TIER +</Button>
        </Stack>
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: '0.5rem',
                bgcolor: 'background.paper',
            }}>

            {(props.monarch?.father?.reigns.length || 0) > 0 ? (
                <RulingRelativeCard monarch={props.monarch?.father || null} title={'Father'}/>
            ) : ''}
            {(props.monarch?.mother?.reigns.length || 0) > 0 ? (
                <RulingRelativeCard monarch={props.monarch?.mother || null} title={'Mother'}/>
            ) : ''}

            {props.monarch?.children.filter(m => m.reigns.length > 0).map(m => (
                <RulingRelativeCard monarch={m} title={m.gender === 'MALE' ? 'Son' : 'Daughter'}/>
            ))}

            {tier <= 1 ? '' : spouses?.filter(m => m.reigns.length > 0).map(m => (
                <RulingRelativeCard monarch={m} title={m.gender === 'MALE' ? 'Husband' : 'Wife'}/>
            ))}

            {tier <= 1 ? '' : siblings?.filter(m => m.reigns.length > 0).map(m => (
                <RulingRelativeCard monarch={m} title={m.gender === 'MALE' ? 'Brother' : 'Sister'}/>
            ))}

            {tier <= 2 ? '' : parentSiblings?.filter(m => m.reigns.length > 0).map(m => (
                <RulingRelativeCard monarch={m} title={m.gender === 'MALE' ? 'Uncle' : 'Aunt'}/>
            ))}

            {tier <= 2 ? '' : niblings?.filter(m => m.reigns.length > 0).map(m => (
                <RulingRelativeCard monarch={m} title={m.gender === 'MALE' ? 'Nephew' : 'Niece'}/>
            ))}

            {tier <= 2 ? '' : cousins?.filter(m => m.reigns.length > 0).map(m => (
                <RulingRelativeCard monarch={m} title={m.gender === 'MALE' ? 'Cousin' : 'Cousine'}/>
            ))}

        </Box>
    </Stack>);
}