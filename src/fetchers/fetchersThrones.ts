import {Monarch, Reign, Throne, ThroneDetails} from "../utils/types";
import {base_url, path_graphql_query} from "../utils/constants";
import {buildRequest, parseMonarch, parseReign} from "./fetchersUtils";

export async function fetchAllThrones(): Promise<Throne[]> {
    const query = `{ 
    thrones {
        name
        country
        flagUrl
        geography
        latestReign {
        uuid
            end
            monarch {
                uuid
                name
                death
                imageUrl
            }
        }
        reigns {
            start
        }
    }
    }`
    const request = buildRequest(query);
    const response = await fetch(`${base_url}${path_graphql_query}`, request)
    if (!response.ok) {
        throw new Error(`Network error: ${response.status}`);
    }
    const json = await response.json();

    return parseAllThrones(json);
}

function parseAllThrones(response: any): Throne[] {
    return response.data.thrones.map((throneData: any): Throne => {
        return {
            name: throneData.name,
            country: throneData.country,
            flagUrl: throneData.flagUrl,
            years: buildYears(throneData.reigns, throneData.latestReign),
            exists: throneData.latestReign.end === null,
            monarchs: throneData.reigns.length,
            geography: throneData.geography,
            lastMonarch: parseMonarch(throneData.latestReign.monarch),
        }
    })
}

export async function fetchThroneDetails(country: string): Promise<ThroneDetails> {
    const query = `
    { throne(country:"_COUNTRY_") {
            name
            country
            flagUrl
            geography
            description
            latestReign {
                start
                end
                monarch {
                    uuid
                    name
                }
            }
            reigns {
                    uuid
                    title
                    start
                    end
                monarch {
                    uuid
                    name
                    birth
                    death
                    imageUrl
                    reigns {
                        country
                    }
                }
            }
        }
        }
    `.replace("_COUNTRY_", country.toUpperCase());
    const request = buildRequest(query);
    const response = await fetch(`${base_url}${path_graphql_query}`, request)
    if (!response.ok) {
        throw new Error(`Network error: ${response.status}`);
    }
    const json = await response.json();

    return parseThroneDetails(json);
}

function parseThroneDetails(response: any): ThroneDetails {
    const throne = response.data.throne;
    const retval = {
        name: throne.name,
        country: throne.country,
        flagUrl: throne.flagUrl,
        years: buildYears(throne.reigns, throne.latestReign),
        lastMonarch: parseMonarch(throne.latestReign.monarch),
        exists: throne.latestReign.end === null,
        monarchs: throne.reigns.length,
        geography: throne.geography,
        description: throne.description,
        reigns: throne.reigns.map((reign: any) => parseReign(reign))
    }
    // console.log(retval)
    return retval
}

function buildYears(reigns: any, latestReign: any): string {
    return reigns
            .map((r: any) => r.start)
            .filter((s: any): s is string => typeof s === 'string' && s.length >= 4)
            .map((s: string) => s.substring(0, 4))
            .sort()[0] + ' - ' +
        (latestReign.end === null ? 'now' : latestReign.end.substring(0, 4));
}