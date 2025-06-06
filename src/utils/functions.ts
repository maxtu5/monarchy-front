export function lifeTime(birth: Date | null, death: Date | null): string {
    if (birth === null) {
        return ''
    } else {
        // @ts-ignore
        return death === null ? ` (${new Date(Date.now() - birth).getFullYear() - 1970} years)` : ` (${new Date(death - birth).getFullYear() - 1970} years)`
    }
}

export function mergeTwoDates(start: Date | null, end: Date | null): string {
    const first = start === null ? 'NA' : start.toISOString().slice(0, 4)
    const last = end === null ?
        (start!==null && start.getFullYear()>1899 ? 'now' : 'NA') :
        end.toISOString().slice(0, 4)
    return first + '—' + last
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