import {Monarch, Reign} from "../utils/types";

export function buildRequest(s: string): RequestInit {
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

export function parseMonarch(response: any): Monarch | null {
    if (!response) return null;

    return {
        id: response.uuid ?? null,
        name: response.name ?? null,
        gender: response.gender ?? null,
        birth: response.birth!==null ? new Date(response.birth) : null,
        death: response.death!==null ? new Date(response.death) : null,
        status: response.status ?? null,
        imageUrl: sanitizeImageUrl(response.imageUrl) ?? '',
        description: response.description ?? null,
        imageCaption: response.imageCaption ?? null,

        mother: response.mother ? parseMonarch(response.mother) : null,
        father: response.father ? parseMonarch(response.father) : null,

        reigns: Array.isArray(response.reigns)
            ? response.reigns.map((reign: any) => parseReign(reign))
            : [],

        url: response.url ?? null,

        children: Array.isArray(
            response.gender === 'MALE'
                ? response.paternalChildren
                : response.maternalChildren
        )
            ? (response.gender === 'MALE'
                    ? response.paternalChildren
                    : response.maternalChildren
            ).map((child: any) => parseMonarch(child))
            : []
    };
}

export function sanitizeImageUrl(imageUrl: string | undefined): string|undefined {
    console.log(imageUrl)
    let ret = !imageUrl ? imageUrl : imageUrl.includes('220px') ? imageUrl.replace('220px', '250px') : imageUrl;
    ret = !ret ? ret : ret.includes('150px') ? ret.replace('150px', '120px') : ret;
    return ret;
}

export function parseReign(response: any): Reign | null {
    if (!response) return null;   // handles null, undefined, missing

    return {
        id: response.uuid ?? null,
        title: response.title ?? null,
        start: response.start!==null ? new Date(response.start) : null,
        end: response.end!==null ? new Date(response.end) : null,
        country: response.country ?? null,
        coronation: response.coronation ?? null,
        predecessor: response.predecessor
            ? parseReign(response.predecessor)
            : null,
        successor: response.successor
            ? parseReign(response.successor)
            : null,
        monarch: parseMonarch(response.monarch)
    };
}