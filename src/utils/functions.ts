import {Throne} from "./types";

export function lifeTime(birth: Date | null, death: Date | null): string {
    if (birth === null) {
        return ''
    } else {
        // @ts-ignore
        return death === null ? ` (${new Date(Date.now() - birth).getFullYear() - 1970} years)` : ` (${new Date(death - birth).getFullYear() - 1970} years)`
    }
}

export function mergeTwoDates(start: Date | null, end: Date | null): string {
    // console.log( end)
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

