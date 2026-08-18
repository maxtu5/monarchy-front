import {Monarch, Reign} from "../utils/types";

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