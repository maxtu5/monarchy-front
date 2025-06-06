interface ThroneBase {
    id: string,
    name: string,
    country: string,
    flagUrl: string,
    years: string,
    monarchs: number
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

export interface ContextData {
    thrones: ThroneCardData[],
    monarch: Monarch | null,
    selectedThrone: ThroneDetails | null,
    setSelectedThrone: (ThroneDetails: ThroneDetails) => void,
    setMonarch: (m: Monarch | null)=> void,
    setMode: (n: number) => void
}