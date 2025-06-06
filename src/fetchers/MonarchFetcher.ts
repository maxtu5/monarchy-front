import {Monarch, Reign} from "../utils/types";
import {
    base_url,
    path_graphql_query,
    request_graphql_monarchdetails,
    request_graphql_sametimers, request_graphql_siblings, request_graphql_spouses
} from "../utils/constants";

function buildRequest(s: string): RequestInit {
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: s
        })
    };
}

// @ts-ignore
export async function loadMonarch(id: string|null): Monarch | null {
    const request = buildRequest(request_graphql_monarchdetails.replace('_ID_', `"${id}"`))

    const retval = await fetch(`${base_url}${path_graphql_query}`, request)// 'http://localhost:8080/data/thrones/', request) //
        .then(response => {
            // if (response.status === 200) {
            return response.json();
            // } else {
            //     throw new Error(response.status.toString());
            // }
        })
        .then(data => {
            const main: Monarch | null = extractMonarch(data.data.monarch, true)
            main.mother = data.data.monarch.mother===null ? null : extractMonarch(data.data.monarch.mother, false)
            main.father = data.data.monarch.father===null ? null : extractMonarch(data.data.monarch.father, false)
            main.children = [...data.data.monarch.children].map((child)=>extractMonarch(child, false))
            return main
        })
    return retval
}

export async function loadSameTimers(id: string | undefined, from: Date, to: Date): Promise<Monarch[]> {
    const request = buildRequest(request_graphql_sametimers
        .replace('_ID_', `${id}`)
        .replace('_FROM_', `${from.toISOString().slice(0,10)}`)
        .replace('_TO_', `${to.toISOString().slice(0,10)}`))

    const retval = await fetch(`${base_url}${path_graphql_query}`, request)
        .then(response => {
            return response.json();
        })
        .then(data => {
            return data.data.sametimerulers.map((m: any)=>extractMonarch(m, false))
        })
    return retval;
}

export async function loadSimpleMonarchList(id: string | undefined, query: string, field: string): Promise<Monarch[]> {
    const request = buildRequest(query
        .replace('_ID_', `${id}`))
    console.log(request)
    const retval = await fetch(`${base_url}${path_graphql_query}`, request)
        .then(response => {
            return response.json();
        })
        .then(data => {
            return data.data[field].map((m: any)=>extractMonarch(m, false))
        })
    return retval;
}

// @ts-ignore
function createReign(r: any, withDetails: boolean): Reign {
    const succ: Monarch | null = !withDetails? null :
        r.successor === null? null :extractMonarch(r.successor.monarch, false)
    if (succ!==null) succ.reigns.push(createReign(r.successor.reign, false))
    const pred: Monarch | null = !withDetails? null :
        r.predecessor === null? null :extractMonarch(r.predecessor.monarch, false)
    if (pred!==null) pred.reigns.push(createReign(r.predecessor.reign, false))
    return {
        id: r.id,
        title: r.title,
        country: r.country,
        start: r.start===null? null : new Date(r.start),
        end: r.end===null? null : new Date(r.end),
        coronation: r.coronation===null? null : new Date(r.coronation),
        successor: succ,
        predecessor: pred
    };
}

// @ts-ignore
function extractMonarch(data, withDetails: boolean): Monarch {
    const reigns: Reign[] = []
    if (data.hasOwnProperty('reigns')) {
        [...data.reigns]
                .filter((r) => r !== null && r.id !== null && r.id !== 'null')
                .map((r) => {
                    return createReign(r, withDetails)
                })
            .forEach(r=> reigns.push(r))
    }
    return {
        id: data.id,
        name: data.name,
        url: data.url,
        gender: data.gender,
        birth: data.birth === null ? null : new Date(data.birth),
        death: data.death === null ? null : new Date(data.death),
        status: data.status,
        imageUrl: data.imageUrl,
        imageCaption: data.imageCaption,
        reigns: reigns,
        father: null,
        mother: null,
        children: []
    }
}