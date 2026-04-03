import {Box, Divider, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Monarch} from "../../utils/types";
import {ScrollContainer, ScrollItem} from "../shared/ScrollContainer";
import GenericTile from "../shared/GenericTile";
import DisplayName from "../shared/DisplayName";
import {fetchLivingNobles} from "../../fetchers/fetchersMonarchs";

function LivingSelector() {
    const [livingNobles, setLivingNobles] = useState<Monarch[]>([])

    useEffect(() => {
        fetchLivingNobles().then((nobles: Monarch[]) => setLivingNobles(nobles))
    }, []);

    return (
        <Box sx={{m: 1, bgcolor: "#ddd"}}>

            <Box sx={{display: "flex", justifyContent: "space-between", m: 1}}>
                <Typography variant={'h5'}>Now living nobles ({livingNobles.length})</Typography>
                {/*<Typography variant={'h6'}><Link to={'/nobles'}>VIEW ALL =</Link></Typography>*/}
            </Box>
            <Divider sx={{mb: 0}}/>

            <ScrollContainer>
                {livingNobles.map(noble => (
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

export function AllNoblesScreen() {
    return (<>
        <LivingSelector/>
        {/*<MonarchSelector/>*/}
        {/*<SearchBar/>*/}
    </>);
}