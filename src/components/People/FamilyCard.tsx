import React, {useContext, useEffect, useState} from 'react';
import {Box, Card, CardContent, Icon, Link, Stack, Typography} from "@mui/material";
import {KingdomContext} from "../../utils/context";

import FamilyMemberCard from "./FamilyMemberCard";
import {compareDates} from "../../utils/functions";

function FamilyCard() {
    const {monarch, setMonarch} = useContext(KingdomContext)
    console.log(monarch?.children)
    return (
        <Card variant="outlined">
            <CardContent>
                <Typography gutterBottom sx={{color: 'text.secondary', fontSize: 14, mb: 1.5}}>
                    {monarch?.status}
                </Typography>
                <Stack direction={'row'} spacing={2} paddingBottom={'0.5rem'}>
                    {FamilyMemberCard(monarch?.mother ? monarch.mother : null, 'Mother')}
                    {FamilyMemberCard(monarch?.father ? monarch.father : null, 'Father')}
                </Stack>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        // p: 1,
                        // m: 1,
                        bgcolor: 'background.paper',
                        // borderRadius: 1,
                    }}
                >
                {monarch?.children
                    .sort((a,b)=>compareDates(a.birth, b.birth))
                    .map((child, index) =>
                    FamilyMemberCard(child, `Child ${index+1}`)
                )}
                </Box>
            </CardContent>
        </Card>
    )
}

export default FamilyCard