export interface Throne {
    name: string,
    country: string,
    flagUrl: string,
    years: string,
    monarchs: number,
    exists: boolean,
    geography: string,
    lastMonarch: Monarch | null
}

export interface ThroneDetails extends Throne {
    description: string,
    reigns: Reign[],
    connectedThrones?: Map<string, string[]>
}

export interface Reign {
    id: string,
    title: string,
    country: string,
    monarch: Monarch | null,
    start: Date | null,
    end: Date | null,
    coronation: Date | null,
    predecessor: Reign | null,
    successor: Reign | null
}

export interface GroupedReign extends Reign {
    countries: string[]
}


export interface Monarch {
    id: string,
    name: string,
    description: string,
    url: string,
    gender: string | null,
    birth: Date | null,
    death: Date | null,
    status: string,
    imageUrl: string,
    imageCaption: string,
    reigns: Reign[],
    father: Monarch | null,
    mother: Monarch | null,
    children: Monarch[]
}

export interface ContextData {
    allThrones: Throne[],
    throne: ThroneDetails | null,
    setThrone: (ThroneDetails: ThroneDetails|null) => void,
    monarch: Monarch | null,
    setMonarch: (m: Monarch | null)=> void
}