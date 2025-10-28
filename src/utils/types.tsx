interface ThroneBase {
    id: string,
    name: string,
    country: string,
    flagUrl: string,
    years: string,
    monarchs: number
}

export interface ThroneCardData extends ThroneBase {
    lastMonarch: {
        reign: Reign,
        monarch: Monarch
    },
}

export interface ThroneDetails extends ThroneBase {
    restMonarchs: {
        reign: Reign,
        monarch: Monarch
    }[]
}

export interface Reign {
    id: string,
    title: string,
    country: string,
    start: Date | null,
    end: Date | null,
    coronation: Date | null,
    predecessor: Monarch | null,
    successor: Monarch | null
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
    allThrones: ThroneCardData[],
    throne: ThroneDetails | null,
    setThrone: (ThroneDetails: ThroneDetails) => void,
    monarch: Monarch | null,
    setMonarch: (m: Monarch | null)=> void
}