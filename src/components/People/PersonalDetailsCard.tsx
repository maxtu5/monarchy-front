import React, {useContext, useEffect, useState} from 'react';
import {Box, Card, CardContent, CardMedia, Link, Stack, Typography} from "@mui/material";
import {KingdomContext} from "../../utils/context";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import {lifeTime} from "../../utils/functions";
import {
    base_url,
    path_graphql_query,
    request_graphql_monarchdetails,
    request_graphql_thrones,
    second_url
} from "../../utils/constants";
import {Monarch} from "../../utils/types";


// @ts-ignore
async function getMonarchDesc(id: string | undefined): string {

}


function PersonalDetailsCard() {
    const {monarch} = useContext(KingdomContext)
    const [decs, setDecs] = useState<string>("");

    useEffect(() => {
        const request = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }
        console.log(monarch?.id)
        console.log(request)

        fetch(`${second_url}/data/monarchs/descbyid/${monarch?.id}`, request)
            .then(response => {
                return response.text();
            })
            .then(data => {
                setDecs(data)
            })
    }, [])

    return (
        <Card variant="outlined">

            <CardContent>
                <Stack direction={'row'} spacing={2}>
                    <Stack>

                        <CardMedia
                            component="img"
                            alt={monarch?.imageCaption}
                            src={monarch?.imageUrl}
                            sx={{width: '150px'}}
                        />
                        <Typography variant="body2" component="div"
                                    sx={{width: '150px'}}>
                            {monarch?.imageCaption}
                        </Typography>
                    </Stack>
                    <Stack>
                        <Typography variant="h5" component="div">
                            {monarch?.name}
                        </Typography>
                        {/*<Typography sx={{color: 'text.secondary', mb: 1.5}}>*/}
                        {/*    <Link href={monarch?.url}> {monarch?.url} </Link>*/}
                        {/*</Typography>*/}
                        <Typography variant="body2" component="div" marginBottom={1}>
                            Birth: {(monarch?.birth === null ? 'NA' : monarch?.birth.toLocaleDateString("en-GB")) + "  "}
                            {monarch?.death === null ?
                                (monarch.birth !== null && monarch.birth.getFullYear() > 1899 ?
                                    lifeTime(monarch.birth, monarch === null ? null : monarch?.death) :
                                    "Death: NA") :
                                "Death: " + (monarch?.death === null ? 'NA' : monarch?.death?.toLocaleDateString("en-GB")) + lifeTime(monarch === null ? null : monarch.birth, monarch === null ? null : monarch?.death)
                            }<br/>
                        </Typography>
                        <Typography variant={"body2"}>
                            {decs}
                        </Typography>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default PersonalDetailsCard;