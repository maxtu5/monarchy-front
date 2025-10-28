import {ThroneCardData} from "./types";

export function lifeTime(birth: Date | null, death: Date | null): string {
    if (birth === null) {
        return ''
    } else {
        // @ts-ignore
        return death === null ? ` (${new Date(Date.now() - birth).getFullYear() - 1970} years)` : ` (${new Date(death - birth).getFullYear() - 1970} years)`
    }
}

export function mergeTwoDates(start: Date | null, end: Date | null): string {
    console.log(start, end)
    const first = start ? start.getFullYear().toString() : 'NA';
    const last = end ? end.getFullYear().toString()
        : (start && start.getFullYear() > 1899
            ? 'now'
            : 'NA');

    return `${first}—${last}`;
}

export function mergeTwoDatesCol(start: Date | null, end: Date | null): string {
    console.log(start)
    const first = (start === null) ? 'NA' : start.toISOString().slice(0, 4)
    const last = end === null ?
        (start!==null && start.getFullYear()>1899 ? 'now' : 'NA') :
        end.toISOString().slice(0, 4)
    return first + '\n' + last
}
export function compareDates(a: Date | null, b: Date | null): number {
    return a===null || b===null ? 0 : Date.UTC(a.getFullYear(), a.getMonth(), a.getDate()) - Date.UTC(b?.getFullYear(), b.getMonth(), b.getDate())
}


export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;

    const trimmed = text.substring(0, maxLength - 1);
    const lastSpace = trimmed.lastIndexOf(' ');

    if (lastSpace === -1) {
        return trimmed + '...'; // no spaces found, hard cut
    }

    return trimmed.substring(0, lastSpace) + '...';
}

export function handleThroneApiData(data: any): ThroneCardData {
    return {
        country: data.country,
        id: data.id,
        name: data.name,
        flagUrl: data.flagUrl,
        years: data.props.years,
        monarchs: data.reignscount,
        lastMonarch: {
            reign: {
                id: data.props.lastMonarch.reign.id,
                title: data.props.lastMonarch.reign.title,
                country: data.props.lastMonarch.reign.country,
                start: data.props.lastMonarch.reign.start,
                end: data.props.lastMonarch.reign.end,
                coronation: data.props.lastMonarch.reign.coronation,
                successor: null,
                predecessor: null
            },
            monarch: {
                id: data.props.lastMonarch.monarch.id,
                name: data.props.lastMonarch.monarch.name,
                description: data.props.lastMonarch.monarch.description,
                birth: data.props.lastMonarch.monarch.birth,
                death: data.props.lastMonarch.monarch.death,
                url: data.props.lastMonarch.monarch.url,
                gender: data.props.lastMonarch.monarch.gender,
                status: data.props.lastMonarch.monarch.status,
                imageUrl: data.props.lastMonarch.monarch.imageUrl,
                imageCaption: data.props.lastMonarch.monarch.imageCaption,
                reigns: [],
                father: null,
                mother: null,
                children: []
            }
        }
    }
}
