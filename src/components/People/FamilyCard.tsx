import React, {useContext, useEffect, useState} from 'react';
import {Box, Card, CardContent, Icon, Link, Stack, Typography} from "@mui/material";
import {KingdomContext, ModeContext} from "../../utils/context";

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
    const {setMode} = useContext(ModeContext)
    const {monarch, setMonarch} = useContext(KingdomContext)
    const [relatives, setRelatives] = useState<Map<Relation, Monarch[]>>(new Map<Relation, Monarch[]>())
    const order: Relation[] = ['spouses', 'siblings', 'parent_siblings', 'cousins', 'niblings']

    useEffect(() => {
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

            setRelatives(newRelatives);
        });
    }, [monarch?.id]);

    console.log(relatives)
    return (
        <Box sx={{
            p: 1,
            borderRadius: 2,
            border: '1px solid lightgray',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 1,
            bgcolor: 'background.paper',
        }}>
            <FamilyMemberCard monarch={monarch?.mother ? monarch.mother : null} type={'Mother'}/>
            <FamilyMemberCard monarch={monarch?.father ? monarch.father : null} type={'Father'}/>

            {monarch?.children
                .sort((a, b) => compareDates(a.birth, b.birth))
                .map((child, index) =>
                    <FamilyMemberCard monarch={child} type={`Child ${index + 1}`}/>
                )}

            <Stack width={'100%'}>
                {Array.from(relatives).sort(([keyA], [keyB]) => {
                    const indexA = order.indexOf(keyA);
                    const indexB = order.indexOf(keyB);
                    return indexA - indexB;
                })
                    .flatMap(([key, value]) => value.map(mon => {
                            return <Typography key={mon.id}>
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
        </Box>
    )
}

export default FamilyCard