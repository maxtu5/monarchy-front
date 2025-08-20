import React, {useContext, useEffect, useState} from 'react';
import {Box, Card, CardContent, Icon, Link, Stack, Typography} from "@mui/material";
import {KingdomContext} from "../../utils/context";

import FamilyMemberCard from "./FamilyMemberCard";
import {compareDates} from "../../utils/functions";
import {Monarch} from "../../utils/types";
import {loadMonarch, loadSimpleMonarchList} from "../../fetchers/MonarchFetcher";
import {
    request_graphql_cousins,
    request_graphql_niblings,
    request_graphql_parent_siblings,
    request_graphql_siblings,
    request_graphql_spouses
} from "../../utils/constants";

type Gender = 'MALE' | 'FEMALE';
type Relation =
    | 'sibling'
    | 'spouses'
    | 'siblings'
    | 'parent_siblings'
    | 'cousins'
    | 'niblings';
function getRelationLabel(relation: Relation, gender: Gender): string {
    console.log(relation, gender)
    switch (relation) {
        case 'sibling':
        case 'siblings':
            return gender === 'MALE' ? 'brother' : 'sister';
        case 'spouses':
            return gender === 'MALE' ? 'husband' : 'wife';
        case 'parent_siblings':
            return gender === 'MALE' ? 'uncle' : 'aunt';
        case 'cousins':
            return 'cousin';
        case 'niblings':
            return gender === 'MALE' ? 'nephew' : 'niece';
        default:
            return relation;
    }
}


function FamilyCard() {
    const {monarch, setMonarch, setMode} = useContext(KingdomContext)
    const [relatives, setRelatives] = useState<Map<Relation, Monarch[]>>(new Map<Relation, Monarch[]>())
    const [loadedRelatives, setLoadedRelatives] = useState(false)
    const order: Relation[] = ['spouses', 'siblings', 'parent_siblings', 'cousins', 'niblings']

    useEffect(() => {
        if (!loadedRelatives) {
            const loaders = [
                loadSimpleMonarchList(monarch?.id, request_graphql_spouses, 'spouses'),
                loadSimpleMonarchList(monarch?.id, request_graphql_siblings, 'siblings'),
                loadSimpleMonarchList(monarch?.id, request_graphql_parent_siblings, 'parent_siblings'),
                loadSimpleMonarchList(monarch?.id, request_graphql_niblings, 'niblings'),
                loadSimpleMonarchList(monarch?.id, request_graphql_cousins, 'cousins'),
            ];

            Promise.all(loaders).then(([spouses, siblings, parentSiblings, niblings, cousins]) => {
                const newRelatives = new Map();
                if (spouses.length) newRelatives.set('spouses', spouses);
                if (siblings.length) newRelatives.set('siblings', siblings);
                if (parentSiblings.length) newRelatives.set('parent_siblings', parentSiblings);
                if (niblings.length) newRelatives.set('niblings', niblings);
                if (cousins.length) newRelatives.set('cousins', cousins);

                setRelatives(newRelatives); // assuming you're using useState for relatives
                setLoadedRelatives(true);
            });
        }
    }, [loadedRelatives, monarch?.id]);

    console.log(relatives)
    return (
        <Card variant="outlined">
            <CardContent>
                <Typography gutterBottom sx={{color: 'text.secondary', fontSize: 14, mb: 1.5}}>
                    {monarch?.status}
                </Typography>
                <Stack direction={'row'} spacing={2} paddingBottom={'0.5rem'}>
                    {FamilyMemberCard(monarch?.mother ? monarch.mother : null, 'Mother')}
                    {FamilyMemberCard(monarch?.father ? monarch.father : null, 'Father')}
                </Stack>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        bgcolor: 'background.paper',
                        // borderRadius: 1,
                    }}
                >
                    {monarch?.children
                        .sort((a, b) => compareDates(a.birth, b.birth))
                        .map((child, index) =>
                            FamilyMemberCard(child, `Child ${index + 1}`)
                        )}
                </Box>
                <Stack>
                    {Array.from(relatives).sort(([keyA], [keyB]) => {
                        const indexA = order.indexOf(keyA);
                        const indexB = order.indexOf(keyB);
                        return indexA - indexB;
                    })
                        .flatMap(([key, value]) => value.map(mon => {
                            return   <Typography key={mon.id}>
                                {`${getRelationLabel(key, mon.gender as Gender)} - `}
                                <Link onClick={async () => {
                                    // @ts-ignore
                                    const retval: Monarch | null = await loadMonarch(mon.id);
                                    if (retval !== null) {
                                        setMonarch(retval);
                                        setMode(2)
                                    }
                                }}>
                                    {mon.name}
                                </Link>
                            </Typography>

                        })
                    )}
                </Stack>
            </CardContent>
        </Card>
    )
}

export default FamilyCard