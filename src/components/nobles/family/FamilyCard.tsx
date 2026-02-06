import React, {useContext, useEffect, useState} from 'react';
import {Box} from "@mui/material";
import {KingdomContext} from "../../../utils/context";
import {compareDates} from "../../../utils/functions";
import {Monarch} from "../../../utils/types";
import {fetchMonarchList} from "../../../fetchers/fetchersMonarchs";

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
        setDisplayedRelatives(new Map<Relation, Monarch[]>())
        // console.log(monarch)
        if (!monarch) return
        const baseRelatives = new Map<Relation, Monarch[]>([
            ['parent', [monarch.mother, monarch.father].filter(Boolean) as Monarch[]],
            ['child', (monarch.children ?? [])
                .sort((a, b) => compareDates(a.birth, b.birth))
                .map((child) => child)],
            ['opener', monarch ? [monarch] : []]
        ]);
        const load = async () => {
            try {
                const spouses = await fetchMonarchList(monarch.id, 'spouses')
                baseRelatives.set('spouses', spouses);
                setDisplayedRelatives(baseRelatives)
            } catch (err) {
                console.error("Failed to load throne details", err);
            }
        };
        load();
    }, [monarch]);

    useEffect(() => {
        if (monarch===null || !showAllRelatives) return
        const loaders = [
            fetchMonarchList(monarch.id, 'siblings'),
            fetchMonarchList(monarch.id, 'parent_siblings'),
            fetchMonarchList(monarch.id, 'niblings'),
            fetchMonarchList(monarch.id, 'cousins'),
        ];

        Promise.all(loaders).then(([siblings, parentSiblings, niblings, cousins]) => {
            const updated = new Map(displayedRelatives); // clone the current map

            if (Array.isArray(siblings) && siblings.length)
                updated.set('siblings', siblings);

            if (Array.isArray(parentSiblings) && parentSiblings.length)
                updated.set('parent_siblings', parentSiblings.filter(p=>![monarch.mother?.id, monarch.father?.id].includes(p.id)));

            if (Array.isArray(niblings) && niblings.length)
                updated.set('niblings', niblings.filter(n=>monarch.children.findIndex(m=>m.id===n.id)===-1));

            if (Array.isArray(cousins) && cousins.length)
                updated.set('cousins', cousins.filter(c=>siblings.findIndex(s=>s.id===c.id)===-1));

            setDisplayedRelatives(updated); // trigger re-render with new map
        });
    }, [showAllRelatives]);

    // console.log(displayedRelatives)

    return (<Box sx={{
        // p: 1,
        // borderRadius: 2,
        // border: '1px solid lightgray',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 1.2,
        // bgcolor: 'background.paper',
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