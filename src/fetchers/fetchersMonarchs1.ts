import {Monarch, Reign} from "../utils/types";
import {
    base_url,
    path_post_graphql_query,
} from "../utils/constants";
import { buildPostRequest, extractMonarch, sanitizeImageUrl} from "./fetchersUtils";

export async function fetchMonarch(id: string): Promise<Monarch | null> {
    const query = `query GetMonarchWithFamily($uuid: String!) { 
        monarch(uuid: $uuid) {
            uuid name url description gender birth death status imageUrl imageCaption
            reigns {
                title start end country
                successor {
                    title
                    monarch {
                        uuid name
                        reigns {
                            uuid title start end country
                        }
                    }
                }
                predecessor {
                    title
                    monarch {
                        uuid name
                        reigns {
                            uuid title start end country
                        }
                    }
                }
            }
            father {
                uuid name url description gender birth death status imageUrl imageCaption
                reigns {
                    country
                }
            }
            mother {
                uuid name url description gender birth death status imageUrl imageCaption
                reigns {
                    country
                }
            }
            maternalChildren {
                uuid name url description gender birth death status imageUrl imageCaption
                reigns {
                    country
                }
            }
            paternalChildren {
                uuid name url description gender birth death status imageUrl imageCaption
                reigns {
                    country
                }
            }
        }
    }`;
    const variables = { uuid: id };
    const request = buildPostRequest(query, variables);
    const response = await fetch(`${base_url}${path_post_graphql_query}`, request);

    if (!response.ok) {
        throw new Error(`Network error: ${response.status}`);
    }

    const json = await response.json();
    return extractMonarch(json.data.monarch, false);
}

const RELATIONSHIPS: Record<string, {
    query: string,
    paths: string[],
    post?: (list: Monarch[], id: string) => Monarch[]
}> = {
    siblings: {
        query: `query GetSiblings($uuid: String!) { 
            monarch(uuid: $uuid) {
                uuid
                father { uuid paternalChildren { uuid name gender birth death imageUrl reigns {country}} }
                mother { uuid maternalChildren { uuid name gender birth death imageUrl reigns {country}} }
            }
        }`,
        paths: ['father.paternalChildren', 'mother.maternalChildren'],
        post: (list, id) => list.filter(m => m.id !== id)
    },

    spouses: {
        query: `query GetSpouses($uuid: String!) { 
            monarch(uuid: $uuid) {
                uuid
                paternalChildren { uuid mother { uuid name gender birth death imageUrl reigns {country}} }
                maternalChildren { uuid father { uuid name gender birth death imageUrl reigns {country}} }
            }
        }`,
        paths: ['paternalChildren.mother', 'maternalChildren.father'],
        post: (list, id) => list.filter(m => m.id !== id)
    },

    parent_siblings: {   // uncles & aunts
        query: `query GetParentSiblings($uuid: String!) { 
            monarch(uuid: $uuid) {
                uuid
                father { uuid father { uuid paternalChildren { uuid name gender birth death imageUrl reigns {country}} }
                         mother { uuid maternalChildren { uuid name gender birth death imageUrl reigns {country}} } }
                mother { uuid father { uuid paternalChildren { uuid name gender birth death imageUrl reigns {country}} }
                         mother { uuid maternalChildren { uuid name gender birth death imageUrl reigns {country}} } }
            }
        }`,
        paths: [
            'father.father.paternalChildren',
            'father.mother.maternalChildren',
            'mother.father.paternalChildren',
            'mother.mother.maternalChildren'
        ],
        post: (list, id) => list.filter(m => m.id !== id) // remove parent
    },

    cousins: {
        query: `query GetCousins($uuid: String!) { 
            monarch(uuid: $uuid) {
                uuid
                father {
                    father { paternalChildren { paternalChildren { uuid name gender birth death imageUrl reigns {country}} } }
                    mother { maternalChildren { maternalChildren { uuid name gender birth death imageUrl reigns {country}} } }
                }
                mother {
                    father { paternalChildren { paternalChildren { uuid name gender birth death imageUrl reigns {country}} } }
                    mother { maternalChildren { maternalChildren { uuid name gender birth death imageUrl reigns {country}} } }
                }
            }
        }`,
        paths: [
            'father.father.paternalChildren.paternalChildren',
            'father.mother.maternalChildren.maternalChildren',
            'mother.father.paternalChildren.paternalChildren',
            'mother.mother.maternalChildren.maternalChildren'
        ],
        post: (list, id) => list.filter(m => m.id !== id)
    },

    niblings: { // nieces & nephews
        query: `query GetNiblings($uuid: String!) { 
            monarch(uuid: $uuid) {
                uuid
                father { paternalChildren { paternalChildren { uuid name gender birth death imageUrl reigns {country}} } }
                mother { maternalChildren { maternalChildren { uuid name gender birth death imageUrl reigns {country}} } }
            }
        }`,
        paths: [
            'father.paternalChildren.paternalChildren',
            'mother.maternalChildren.maternalChildren'
        ]
    }
};

export async function fetchMonarchList(id: string, variant: string): Promise<Monarch[]> {
    const rel = RELATIONSHIPS[variant];
    if (!rel) return [];

    const variables = { uuid: id };
    const request = buildPostRequest(rel.query, variables);

    const response = await fetch(`${base_url}${path_post_graphql_query}`, request);
    if (!response.ok) throw new Error(`Network error: ${response.status}`);

    const json = await response.json();
    const root = json.data.monarch;

    let list = parseMonarchList(rel.paths, root);

    if (rel.post) list = rel.post(list, id);

    return list;
}


function parseMonarchList(subpaths: string[], response: any): Monarch[] {
    const collected: Monarch[] = [];

    for (const path of subpaths) {
        const keys = path.split('.');

        // Start with a list of nodes to explore
        let nodes: any[] = [response];

        for (const key of keys) {
            const nextNodes: any[] = [];

            for (const node of nodes) {
                if (!node) continue;

                const value = node[key];

                if (Array.isArray(value)) {
                    nextNodes.push(...value);
                } else if (value && typeof value === 'object') {
                    nextNodes.push(value);
                }
            }

            nodes = nextNodes;
        }

        // Parse all final nodes
        for (const node of nodes) {
            const parsed = extractMonarch(node, false);
            if (parsed) collected.push(parsed);
        }
    }

    // Deduplicate by UUID
    const unique = collected.filter(
        (m, i, arr) => arr.findIndex(x => x.id === m.id) === i
    );
    return unique;
}

const MONARCH_FIELDS_FRAGMENT = `
    uuid
    name
    birth
    death
    imageUrl
    reigns {
        uuid 
        country
    }
`;

async function executeMonarchsQuery(
    queryName: string,
    filterString: string,
    orderString: string,
    variables: Record<string, any>
): Promise<Monarch[]> {

    const query = `query ${queryName}(${Object.keys(variables).map(k => `$${k}: Int!`).join(', ')}) {
        monarchs(${filterString}, order: ${orderString}, skip: $skip, limit: $limit) {
            ${MONARCH_FIELDS_FRAGMENT}
        }
    }`;

    const request = buildPostRequest(query, variables);
    const response = await fetch(`${base_url}${path_post_graphql_query}`, request);
    if (!response.ok) {
        throw new Error(`Network error: ${response.status}`);
    }

    const json = await response.json();
    if (json.errors && !json.data?.monarchs) {
        console.error("GraphQL Errors:", json.errors);
        throw new Error(json.errors[0]?.message || "GraphQL execution error");
    }

    return (json.data?.monarchs || []).map((m: any) => extractMonarch(m, false));
}

export function fetchRandomNobles(skip = 0, limit = 20): Promise<Monarch[]> {
    return executeMonarchsQuery("GetRandomNobles", "", "random", { skip, limit });
}

export function fetchLivingNobles(skip = 0, limit = 20): Promise<Monarch[]> {
    return executeMonarchsQuery(
        "GetLivingNobles",
        'filter: { lifetime: { range: { from: "1890-infinity", to: "null" } } }',
        "birth",
        { skip, limit }
    );
}

export function fetchSameTimers(from: string, to: string, skip = 0, limit = 20): Promise<Monarch[]> {
    const query = `query GetSameTimers($from: String!, $to: String!, $skip: Int!, $limit: Int!) {
        monarchs(filter: { reigntime: { range: { from: $from, to: $to } } }, order: birth, skip: $skip, limit: $limit) {
            ${MONARCH_FIELDS_FRAGMENT}
        }
    }`;

    return runDirectQuery(query, { from, to, skip, limit });
}

export function findMonarchsByName(name: string, skip = 0, limit = 20): Promise<Monarch[]> {
    const query = `query GetMonarchsByText($name: String!, $skip: Int!, $limit: Int!) {
        monarchs(filter: { search: { name: $name } }, order: name, skip: $skip, limit: $limit) {
            ${MONARCH_FIELDS_FRAGMENT}
        }
    }`;

    return runDirectQuery(query, { name, skip, limit });
}

export function findMonarchsByYear(year: string, skip = 0, limit = 50): Promise<Monarch[]> {
    const query = `query GetPeopleByLivingYear($year: String!, $skip: Int!, $limit: Int!) {
        monarchs(filter: { lifetime: { range: { from: $year, to: $year } } }, order: birth, skip: $skip, limit: $limit) {
            ${MONARCH_FIELDS_FRAGMENT}
        }
    }`;

    return runDirectQuery(query, { year, skip, limit });
}

async function runDirectQuery(query: string, variables: Record<string, any>): Promise<Monarch[]> {
    const request = buildPostRequest(query, variables);
    const response = await fetch(`${base_url}${path_post_graphql_query}`, request);

    if (!response.ok) throw new Error(`Network error: ${response.status}`);

    const json = await response.json();
    if (json.errors && !json.data?.monarchs) {
        throw new Error(json.errors[0]?.message || "GraphQL error");
    }

    return (json.data?.monarchs || []).map((m: any) => extractMonarch(m, false));
}

// function extractMonarch(source: any, withDetails: boolean): Monarch {
//     const reigns: Reign[] = []
//     if (source.hasOwnProperty('reigns')) {
//         [...source.reigns]
//                 .filter((r) => r !== null && r.uuid !== null && r.uuid !== 'null')
//                 .map((r) => {
//                     return createReign(r, withDetails)
//                 })
//             .forEach(r=> reigns.push(r))
//     }
//     return {
//         id: source.uuid,
//         name: source.name,
//         description: source.description,
//         url: source.url,
//         gender: source.gender,
//         birth: source.birth === null ? null : new Date(source.birth),
//         death: source.death === null ? null : new Date(source.death),
//         status: source.status,
//         imageUrl: source.imageUrl ? sanitizeImageUrl(source.imageUrl) : source.imageUrl,
//         imageCaption: source.imageCaption,
//         reigns: reigns,
//         father: null,
//         mother: null,
//         children: []
//     }
// }
//
// function createReign(source: any, withDetails: boolean): Reign {
//     const succ: Reign | null = !withDetails? null :
//         source.successor === null? null :createReign(source.successor.monarch, false)
//     const pred: Reign | null = !withDetails? null :
//         source.predecessor === null? null :createReign(source.predecessor.monarch, false)
//     return {
//         id: source.uuid,
//         title: source.title,
//         country: source.country,
//         start: source.start===null? null : new Date(source.start),
//         end: source.end===null? null : new Date(source.end),
//         coronation: source.coronation===null? null : new Date(source.coronation),
//         successor: succ,
//         predecessor: pred,
//         monarch: extractMonarch(source, true)
//     };
// }

