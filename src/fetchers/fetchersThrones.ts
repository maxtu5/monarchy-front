import { Reign, Throne, ThronePlus} from "../utils/types";
import {extractMonarch, parseReign, sanitizeImageUrl, sendGraphQLRequest} from "./fetchersUtils";


export async function fetchAllThrones(): Promise<Throne[]> {
    const query = `{ 
    thrones {
        uuid name country flagUrl geography
        latestReign {
        uuid end
            monarch {
                uuid name death imageUrl
            }
        }
        reigns {
            start
        }
    }}`;
    const data = await sendGraphQLRequest(query, {});
    return parseAllThrones(data);
}

function parseAllThrones(data: any): Throne[] {
    return (data?.thrones || []).map((throneData: any): Throne => {
        const latest = throneData.latestReign;

        return {
            name: throneData.name ?? null,
            country: throneData.country ?? null,
            flagUrl: throneData.flagUrl ? sanitizeImageUrl(throneData.flagUrl) : (throneData.flagUrl ?? ''),
            years: buildYears(throneData.reigns, latest),
            exists: latest ? latest.end === null : false,
            monarchs: Array.isArray(throneData.reigns) ? throneData.reigns.length : 0,
            geography: throneData.geography ?? null,
            lastMonarch: latest?.monarch ? extractMonarch(latest.monarch, false) : null,
        };
    });
}

export async function fetchThroneDetails(country: string): Promise<ThronePlus> {
    const query = `query GetThroneDetails($country: String!) {
        throne(country: $country) {
            uuid name country flagUrl geography description
            latestReign {
                uuid start end
                monarch {
                    uuid name
                }
            }
            reigns {
                uuid title start end
                monarch {
                    uuid name birth death imageUrl reigns {
                        country
                    }
                }
            }
        }
    }`;
    const variables = { country: country.toUpperCase() };

    const data = await sendGraphQLRequest(query, variables);
    return parseThroneDetails(data);
}

function parseThroneDetails(data: any): ThronePlus {
    const throne = data?.throne;
    if (!throne) {
        throw new Error("Throne data is missing in the response");
    }

    const latest = throne.latestReign;

    return {
        name: throne.name ?? null,
        country: throne.country ?? null,
        flagUrl: throne.flagUrl ? sanitizeImageUrl(throne.flagUrl) : (throne.flagUrl ?? ''),
        years: buildYears(throne.reigns, latest),
        lastMonarch: latest?.monarch ? extractMonarch(latest.monarch, false) : null,
        exists: latest ? latest.end === null : false,
        monarchs: Array.isArray(throne.reigns) ? throne.reigns.length : 0,
        geography: throne.geography ?? null,
        description: throne.description ?? null,
        reigns: Array.isArray(throne.reigns)
            ? throne.reigns
                .map((reign: any) => parseReign(reign, false))
                .filter((r: any): r is Reign => r !== null)
                .sort((r1: Reign, r2: Reign) => {
                    if (!r1.start || !r2.start) return 0;
                    return r2.start.getTime() - r1.start.getTime(); // Сортировка от новых к старым
                })
            : []
    };
}

function buildYears(reigns: any, latestReign: any): string {
    if (!Array.isArray(reigns) || reigns.length === 0) {
        return latestReign?.end ? `? - ${latestReign.end.substring(0, 4)}` : '? - now';
    }
    const startYears = reigns
        .map((r: any) => r?.start)
        .filter((s: any): s is string => typeof s === 'string' && s.length >= 4)
        .map((s: string) => s.substring(0, 4))
        .sort();

    const firstYear = startYears.length > 0 ? startYears[0] : '?';
    const lastYear = (!latestReign || latestReign.end === null)
        ? 'now'
        : latestReign.end.substring(0, 4);

    return `${firstYear} - ${lastYear}`;
}
