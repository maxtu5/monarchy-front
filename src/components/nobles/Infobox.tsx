import React, {useContext, useEffect, useState} from 'react';
import {Box, Card, CardContent, CardMedia, Link, Stack, Typography} from "@mui/material";
import {KingdomContext} from "../../utils/context";
import {lifeTime} from "../../utils/functions";
import {useDetectScreen} from "../../utils/useDetectScreen";


function Infobox() {
    const {monarch} = useContext(KingdomContext)
    const screen = useDetectScreen();

    return (
        <Card  variant="outlined">
            <CardContent>
                <Stack spacing={1} direction={screen === 'mobile_vertical' ? 'row' : 'column'}>
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

                        <Typography variant="body2" component="div" marginBottom={1}>
                            <strong>Birth:</strong>{' '}
                            {monarch === null || monarch?.birth === null
                                ? 'NA'
                                : monarch.birth.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: '2-digit',
                                    year: 'numeric',
                                })}
                        </Typography>
                        <Typography variant="body2" component="div" marginBottom={1}>
                            <strong>Death:</strong>{' '}
                            {monarch?.death === null ?
                                (monarch.birth !== null && monarch.birth.getFullYear() > 1899 ?
                                    lifeTime(monarch.birth, monarch === null ? null : monarch?.death) :
                                    "NA") : (monarch?.death?.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: '2-digit',
                                    year: 'numeric',
                                }))
                                + lifeTime(monarch === null ? null : monarch.birth, monarch === null ? null : monarch?.death)
                            }
                        </Typography>

                        <Typography sx={{color: 'text.secondary', mb: 1.5}}>
                            <Link target="_blank"
                                  rel="noopener noreferrer"
                                  href={monarch?.url}> wiki </Link>
                        </Typography>
                        <Typography variant={'caption'}>
                            {monarch?.status}
                        </Typography>

                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default Infobox;