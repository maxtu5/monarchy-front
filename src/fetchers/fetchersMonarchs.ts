import {Monarch, Reign} from "../utils/types";
import {
    base_url,
    path_post_graphql_query,
    request_find_monarchs_byyear,
} from "../utils/constants";
import { buildPostRequest, parseMonarch, sanitizeImageUrl} from "./fetchersUtils";

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
    return parseMonarch(json.data.monarch);
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
            const parsed = parseMonarch(node);
            if (parsed) collected.push(parsed);
        }
    }

    // Deduplicate by UUID
    const unique = collected.filter(
        (m, i, arr) => arr.findIndex(x => x.id === m.id) === i
    );
    return unique;
}

export async function fetchRandomNobles(skip = 0, limit = 20): Promise<Monarch[]> {
    const query = `query GetRandomNobles($skip: Int!, $limit: Int!) {
        monarchs(order: random, skip: $skip, limit: $limit) {
            uuid
            name
            birth
            death
            imageUrl
            reigns {
                uuid 
                country
            }
        }
    }`;
    const variables = { skip, limit };

    const request = buildPostRequest(query, variables);
    const response = await fetch(`${base_url}${path_post_graphql_query}`, request);

    if (!response.ok) {
        throw new Error(`Network error: ${response.status}`);
    }

    const json = await response.json();
    return json.data.monarchs.map((m: any) => extractMonarch(m, false));
}


export async function fetchLivingNobles(skip = 0, limit = 20): Promise<Monarch[]> {
    const query = `query GetLivingNobles($skip: Int!, $limit: Int!) {
        monarchs(
            filter: { lifetime: { range: { from: "1890-infinity", to: "null" } } }, 
            order: birth, 
            skip: $skip, 
            limit: $limit
        ) {
            uuid
            name
            birth
            death
            imageUrl
            reigns {
                uuid 
                country
            }
        }
    }`;
    const variables = { skip, limit };

    const request = buildPostRequest(query, variables);
    const response = await fetch(`${base_url}${path_post_graphql_query}`, request);

    if (!response.ok) {
        throw new Error(`Network error: ${response.status}`);
    }

    const json = await response.json();
    return json.data.monarchs.map((m: any) => extractMonarch(m, false));
}


export async function fetchSameTimers(from: string, to: string, skip = 0, limit = 20): Promise<Monarch[]> {
    const query = `query GetSameTimers($from: String!, $to: String!, $skip: Int!, $limit: Int!) {
        monarchs(
            filter: { reigntime: { range: { from: $from, to: $to } } }, 
            order: birth, 
            skip: $skip, 
            limit: $limit
        ) {
            uuid
            name
            birth
            death
            imageUrl
            reigns {
                uuid 
                country
            }
        }
    }`;

    const variables = { from, to, skip, limit };

    const request = buildPostRequest(query, variables);
    const response = await fetch(`${base_url}${path_post_graphql_query}`, request);
    if (!response.ok) {
        throw new Error(`Network error: ${response.status}`);
    }

    const json = await response.json();
    return json.data.monarchs.map((m: any) => extractMonarch(m, false));
}

export async function findMonarchsByName(name: string, skip = 0, limit = 20): Promise<Monarch[]> {
    const query = `query GetMonarchsByText($name: String!, $skip: Int!, $limit: Int!) {
        monarchs(
            filter: { search: { name: $name } }, 
            order: name, 
            skip: $skip, 
            limit: $limit
        ) {
            uuid
            name
            birth
            death
            imageUrl
            reigns {
                uuid 
                country
            }
        }
    }`;

    const variables = { name, skip, limit };

    const request = buildPostRequest(query, variables);
    const response = await fetch(`${base_url}${path_post_graphql_query}`, request);
    if (!response.ok) {
        throw new Error(`Network error: ${response.status}`);
    }

    const json = await response.json();
    return json.data.monarchs.map((m: any) => extractMonarch(m, false));
}

export async function findMonarchsByYear(year: string, skip = 0, limit = 50): Promise<Monarch[]> {
    // В заголовке объявляем $year. Мы передаем его дважды: и в from, и в to,
    // чтобы проверить, что 1897 год находится внутри интервала жизни монарха.
    const query = `query GetPeopleByLivingYear($year: String!, $skip: Int!, $limit: Int!) {
        monarchs(
            filter: { lifetime: { range: { from: $year, to: $year } } }, 
            order: birth, 
            skip: $skip, 
            limit: $limit
        ) {
            uuid
            name
            birth
            death
            imageUrl
            reigns {
                uuid 
                country
            }
        }
    }`;

    // Передаем переменную плоским объектом, как в вашем GetSameTimers
    const variables = { year, skip, limit };

    const request = buildPostRequest(query, variables);
    const response = await fetch(`${base_url}${path_post_graphql_query}`, request);
    if (!response.ok) {
        throw new Error(`Network error: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);

    return json.data.monarchs.map((m: any) => extractMonarch(m, false));
}

async function fetchMonarchs(
    requestTemplate: string,
    searchString: string,
    responseKey: string
): Promise<{ id: string; name: string }[]> {
    try {
        const request = await buildPostRequest(requestTemplate.replace('_SRCH_', `${searchString}`));
        const response = await fetch(`${base_url}${path_post_graphql_query}`, request);

        if (!response.ok) {
            throw new Error(`Network error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        const data = result.data?.[responseKey];
        if (!Array.isArray(data)) {
            throw new Error('Unexpected response format');
        }

        return data.map((m: any) => ({
            id: m.uuid,
            name: m.name,
        }));
    } catch (error) {
        console.error(`Failed to fetch monarchs (${responseKey}):`, error);
        return [];
    }
}

// @ts-ignore
function createReign(r: any, withDetails: boolean): Reign {
    const succ: Reign | null = !withDetails? null :
        r.successor === null? null :createReign(r.successor.monarch, false)
    // if (succ!==null) succ.reigns.push(createReign(r.successor.reign, false))
    const pred: Reign | null = !withDetails? null :
        r.predecessor === null? null :createReign(r.predecessor.monarch, false)
    // if (pred!==null) pred.reigns.push(createReign(r.predecessor.reign, false))
    return {
        id: r.uuid,
        title: r.title,
        country: r.country,
        start: r.start===null? null : new Date(r.start),
        end: r.end===null? null : new Date(r.end),
        coronation: r.coronation===null? null : new Date(r.coronation),
        successor: succ,
        predecessor: pred,
        monarch: extractMonarch(r, true)
    };
}


// @ts-ignore
function extractMonarch(data, withDetails: boolean): Monarch {
    const reigns: Reign[] = []
    if (data.hasOwnProperty('reigns')) {
        [...data.reigns]
                .filter((r) => r !== null && r.uuid !== null && r.uuid !== 'null')
                .map((r) => {
                    return createReign(r, withDetails)
                })
            .forEach(r=> reigns.push(r))
    }
    return {
        id: data.uuid,
        name: data.name,
        description: data.description,
        url: data.url,
        gender: data.gender,
        birth: data.birth === null ? null : new Date(data.birth),
        death: data.death === null ? null : new Date(data.death),
        status: data.status,
        imageUrl: data.imageUrl ? sanitizeImageUrl(data.imageUrl) : data.imageUrl,
        imageCaption: data.imageCaption,
        reigns: reigns,
        father: null,
        mother: null,
        children: []
    }
}

