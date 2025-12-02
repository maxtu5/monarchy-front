import React, {useContext, useEffect, useState} from 'react';
import {Box} from "@mui/material";
import {KingdomContext} from "../../../utils/context";
import {compareDates} from "../../../utils/functions";
import {Monarch} from "../../../utils/types";
import {loadSimpleMonarchList} from "../../../fetchers/fetchers";
import {
    request_graphql_cousins,
    request_graphql_niblings,
    request_graphql_parent_siblings,
    request_graphql_siblings,
    request_graphql_spouses
} from "../../../utils/constants";
import OpenerTile from "./OpenerTile";
import DisplayName from "../../shared/DisplayName";
import GenericTile from "../../shared/GenericTile";

type Gender = 'MALE' | 'FEMALE';
type Relation =
    | 'parent'
    | 'spouses'
    | 'child'
    | 'opener'
    | 'sibling'
    | 'siblings'
    | 'parent_siblings'
    | 'cousins'
    | 'niblings';

function getRelationLabel(relation: Relation, gender: Gender): string {
    switch (relation) {
        case 'parent':
            return gender === 'MALE' ? 'Father' : 'Mother';
        case 'child':
            return 'Child';
        case 'siblings':
            return gender === 'MALE' ? 'Brother' : 'Sister';
        case 'spouses':
            return gender === 'MALE' ? 'Husband' : 'Wife';
        case 'parent_siblings':
            return gender === 'MALE' ? 'Uncle' : 'Aunt';
        case 'cousins':
            return 'Cousin';
        case 'niblings':
            return gender === 'MALE' ? 'Nephew' : 'Niece';
        default:
            return relation;
    }
}

function FamilyCard() {
    const {monarch} = useContext(KingdomContext)
    const [showAllRelatives, setShowAllRelatives] = useState<boolean>(false)
    const [hideNonRuling, setHideNonRuling] = useState<boolean>(false)
    const [displayedRelatives, setDisplayedRelatives] = useState<Map<Relation, Monarch[]>>(new Map<Relation, Monarch[]>())
    const order: Relation[] = ['parent',
        'spouses',
        'child',
        'opener',
        'siblings',
        'parent_siblings',
        'cousins',
        'niblings']

    useEffect(() => {
        setShowAllRelatives(false);
        setHideNonRuling(false)

        const baseRelatives = new Map<Relation, Monarch[]>([
            ['parent', [monarch?.mother, monarch?.father].filter(Boolean) as Monarch[]],
            ['child', (monarch?.children ?? [])
                .sort((a, b) => compareDates(a.birth, b.birth))
                .map((child) => child)],
            ['opener', monarch ? [monarch] : []]
        ]);
        loadSimpleMonarchList(monarch?.id, request_graphql_spouses, 'spouses').then(spouses => {
            baseRelatives.set('spouses', spouses);
            setDisplayedRelatives(baseRelatives);
        });
    }, [monarch]);

    useEffect(() => {
        if (!showAllRelatives) return
        const loaders = [
            loadSimpleMonarchList(monarch?.id, request_graphql_siblings, 'siblings'),
            loadSimpleMonarchList(monarch?.id, request_graphql_parent_siblings, 'parent_siblings'),
            loadSimpleMonarchList(monarch?.id, request_graphql_niblings, 'niblings'),
            loadSimpleMonarchList(monarch?.id, request_graphql_cousins, 'cousins'),
        ];

        Promise.all(loaders).then(([siblings, parentSiblings, niblings, cousins]) => {
            const updated = new Map(displayedRelatives); // clone the current map

            if (Array.isArray(siblings) && siblings.length)
                updated.set('siblings', siblings);

            if (Array.isArray(parentSiblings) && parentSiblings.length)
                updated.set('parent_siblings', parentSiblings);

            if (Array.isArray(niblings) && niblings.length)
                updated.set('niblings', niblings);

            if (Array.isArray(cousins) && cousins.length)
                updated.set('cousins', cousins);

            setDisplayedRelatives(updated); // trigger re-render with new map
        });
    }, [showAllRelatives]);

    console.log(displayedRelatives)

    return (<Box sx={{
        // p: 1,
        // borderRadius: 2,
        // border: '1px solid lightgray',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 1.2,
        bgcolor: 'background.paper',
        // justifyContent:"flex-start"
    }}>

        {Array.from(displayedRelatives.entries())
            .sort(([keyA], [keyB]) => {
                const indexA = order.indexOf(keyA);
                const indexB = order.indexOf(keyB);
                return indexA - indexB;
            })
            .flatMap(([key, members]) =>
                key === 'opener' ?
                    [!showAllRelatives && <OpenerTile key="opener" setShowAll={setShowAllRelatives}/>]
                    : (['parent', 'child', 'spouses', 'opener'].includes(key) || showAllRelatives)
                        ? members.map((monarch, i) => ((monarch.reigns.length > 0 || !hideNonRuling) ?
                                <GenericTile
                                    key={monarch.id}
                                    displayedMonarch={monarch}
                                    width={'32.6%'}
                                >
                                    <DisplayName
                                        monarch={monarch}
                                        type={getRelationLabel(key, monarch.gender as Gender) + (key==='child' ? ` (${i+1}/${members.length})` : '')}
                                        displayCrown={monarch.reigns.length > 0}
                                        crownOnClick={()=>setHideNonRuling(!hideNonRuling)}
                                    />
                                </GenericTile> : null
                        ))
                        : []
            )}
    </Box>)
}

export default FamilyCard