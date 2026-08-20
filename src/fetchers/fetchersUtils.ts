import {Monarch, Reign} from "../utils/types";
import {base_url, path_post_graphql_query} from "../utils/constants";

export async function sendGraphQLRequest(query: string, variables: Record<string, any>): Promise<any> {
    const request = buildPostRequest(query, variables);
    const response = await fetch(`${base_url}${path_post_graphql_query}`, request);
    if (!response.ok) {
        throw new Error(`Network error: ${response.status}`);
    }
    const json = await response.json();
    if (json.errors && !json.data) {
        console.error("GraphQL Errors:", json.errors);
        throw new Error(json.errors?.message || "GraphQL Execution Error");
    }
    return json.data;
}

export function buildPostRequest(query: string, variables: Record<string, any> = {}): RequestInit {
    const body = JSON.stringify({query, variables});
    return {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body
    };
}

export function extractMonarch(source: any, withFamily = false): Monarch | null {
    if (!source) return null;

    const reigns: Reign[] = Array.isArray(source.reigns)
        ? source.reigns
            .filter((r: any) => r !== null && r.uuid !== null && r.uuid !== 'null')
            .map((r: any) => parseReign(r, withFamily))
            .filter((r: any): r is Reign => r !== null)
        : [];

    const monarch: Monarch = {
        id: source.uuid ?? null,
        name: source.name ?? null,
        description: source.description ?? null,
        url: source.url ?? null,
        gender: source.gender ?? null,
        birth: source.birth ? new Date(source.birth) : null,
        death: source.death ? new Date(source.death) : null,
        status: source.status ?? null,
        imageUrl: source.imageUrl ? sanitizeImageUrl(source.imageUrl) : (source.imageUrl ?? ''),
        imageCaption: source.imageCaption ?? null,
        reigns: reigns,
        father: null,
        mother: null,
        children: []
    };

    if (withFamily) {
        monarch.father = source.father ? extractMonarch(source.father, false) : null;
        monarch.mother = source.mother ? extractMonarch(source.mother, false) : null;

        const childrenSource = source.gender === 'MALE'
            ? source.paternalChildren
            : source.maternalChildren;

        monarch.children = Array.isArray(childrenSource)
            ? childrenSource
                .map((child: any) => extractMonarch(child, false))
                .filter((m): m is Monarch => m !== null)
            : [];
    }

    return monarch;
}

export function parseReign(source: any, withDetails = false): Reign | null {
    if (!source) return null;

    return {
        id: source.uuid ?? null,
        title: source.title ?? null,
        country: source.country ?? null,
        start: source.start ? new Date(source.start) : null,
        end: source.end ? new Date(source.end) : null,
        coronation: source.coronation ? new Date(source.coronation) : null,

        successor: withDetails && source.successor
            ? parseReign(source.successor, false)
            : null,
        predecessor: withDetails && source.predecessor
            ? parseReign(source.predecessor, false)
            : null,

        monarch: source.monarch ? extractMonarch(source.monarch, false) : null
    };
}

export function sanitizeImageUrl(imageUrl: string | undefined): string|undefined {
    // console.log(imageUrl)
    let ret = !imageUrl ? imageUrl : imageUrl.includes('220px') ? imageUrl.replace('220px', '250px') : imageUrl;
    ret = !ret ? ret : ret.includes('230px') ? ret.replace('230px', '250px') : ret;
    ret = !ret ? ret : ret.includes('200px') ? ret.replace('200px', '250px') : ret;
    ret = !ret ? ret : ret.includes('240px') ? ret.replace('240px', '250px') : ret;
    ret = !ret ? ret : ret.includes('210px') ? ret.replace('210px', '250px') : ret;
    ret = !ret ? ret : ret.includes('150px') ? ret.replace('150px', '120px') : ret;
    ret = !ret ? ret : ret.includes('2560px') ? ret.replace('2560px', '250px') : ret;
    ret = !ret ? ret : ret.includes('1024px') ? ret.replace('1024px', '250px') : ret;
    ret = !ret ? ret : ret.includes('1250px') ? ret.replace('1250px', '250px') : ret;
    ret = !ret ? ret : ret.includes('640px') ? ret.replace('640px', '250px') : ret;
    ret = !ret ? ret : ret.includes('225px') ? ret.replace('225px', '250px') : ret;
    ret = !ret ? ret : ret.includes('180px') ? ret.replace('180px', '250px') : ret;
    ret = !ret ? ret : ret.includes('260px') ? ret.replace('260px', '250px') : ret;

    return ret;
}