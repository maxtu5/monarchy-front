import React, {useContext, useEffect, useState} from 'react';
import {Box, Card, CardContent, CardMedia, Link, Stack, Typography} from "@mui/material";
import {KingdomContext} from "../../utils/context";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import {lifeTime} from "../../utils/functions";
import {
    second_url
} from "../../utils/constants";
import {Monarch} from "../../utils/types";

function PersonalDetailsCard() {
    const {monarch} = useContext(KingdomContext)

    return (
        <Card variant="outlined">

            <CardContent>
                <Stack
                    // direction={'row'}
                    spacing={2}>

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

                        {/*<Typography sx={{color: 'text.secondary', mb: 1.5}}>*/}
                        {/*    <Link href={monarch?.url}> {monarch?.url} </Link>*/}
                        {/*</Typography>*/}
                        <Typography variant="body2" component="div" marginBottom={1}>
                            Birth: {(monarch?.birth === null ? 'NA' : monarch?.birth.toLocaleDateString("en-GB")) + "  "}
                        </Typography>
                        <Typography variant="body2" component="div" marginBottom={1}>

                        {monarch?.death === null ?
                                (monarch.birth !== null && monarch.birth.getFullYear() > 1899 ?
                                    lifeTime(monarch.birth, monarch === null ? null : monarch?.death) :
                                    "Death: NA") :
                                "Death: " + (monarch?.death === null ? 'NA' : monarch?.death?.toLocaleDateString("en-GB")) + lifeTime(monarch === null ? null : monarch.birth, monarch === null ? null : monarch?.death)
                            }
                        </Typography>
                        <Typography gutterBottom sx={{color: 'text.secondary', fontSize: 14, mb: 1.5}}>
                            {monarch?.status}
                        </Typography>

                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default PersonalDetailsCard;