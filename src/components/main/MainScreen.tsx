import {Box, Divider, Typography} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import {KingdomContext} from "../../utils/context";
import GenericTile from "../shared/GenericTile";
import {Link} from "react-router-dom";
import {ScrollContainer, ScrollItem} from "../shared/ScrollContainer";
import {Monarch} from "../../utils/types";
import {fetchRandomNobles} from "../../fetchers/fetchersMonarchs";
import DisplayName from "../shared/DisplayName";

function ThroneSelector() {
    const {allThrones} = useContext(KingdomContext)

    return (
        <Box sx={{m: 1, bgcolor: "#ddd"}}>

            <Box sx={{display: "flex", justifyContent: "space-between", m: 1}}>
                <Typography variant={'h5'}>Explore thrones</Typography>
                <Typography variant={'h6'}><Link to={'/thrones'}>VIEW ALL =</Link></Typography>
            </Box>
            <Divider sx={{mb: 0}}/>

            <ScrollContainer>
                {allThrones.map(throne => (
                    <ScrollItem
                        key={throne.country}
                        tile={
                            <GenericTile
                                width="250px"
                                displayedThrone={throne}
                            />
                        }
                        stripes={[]}
                    />
                ))}
            </ScrollContainer>
        </Box>
    )
}

function NobleSelector() {
    const [randomNobles, setRandomNobles] = useState<Monarch[]>([])

    useEffect(() => {
        fetchRandomNobles(50)
            .then((nobles: Monarch[]) => setRandomNobles(nobles.filter(n => n.imageUrl !== '')))
    }, []);

    return (
        <Box sx={{m: 1, bgcolor: "#ddd"}}>

            <Box sx={{display: "flex", justifyContent: "space-between", m: 1}}>
                <Typography variant={'h5'}>Explore nobles</Typography>
                <Typography variant={'h6'}><Link to={'/nobles'}>VIEW ALL =</Link></Typography>
            </Box>
            <Divider sx={{mb: 0}}/>

            <ScrollContainer>
                {randomNobles.map(noble => (
                    <ScrollItem
                        key={noble.id}
                        tile={
                            <GenericTile
                                width="250px"
                                displayedMonarch={noble}
                            >
                                <DisplayName monarch={noble} type="" displayCrown={true} />
                            </GenericTile>
                        }
                        stripes={[]}   // or add stripes later
                    />
                ))}
            </ScrollContainer>
        </Box>
    );
}

export function MainScreen() {
    return (<>
        <ThroneSelector/>
        <NobleSelector/>
    </>);
}