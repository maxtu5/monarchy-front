import {Monarch} from "../../utils/types";
import {Card, CardContent, CardMedia, Link, Stack, Typography} from "@mui/material";
import {lifeTime, mergeTwoDates} from "../../utils/functions";
import React, {useContext} from "react";
import {KingdomContext} from "../../utils/context";
import DisplayName from "./DisplayName";

const FamilyMemberCard = (monarch: Monarch | null, type: string) =>
    monarch === null ? (<div></div>) : (
        <Card key={monarch.id} sx={{
            m: 1,
            backgroundColor: 'lightcyan'
        }}>

            <CardContent>
                <Stack direction={'row'} spacing={1}>
                    <CardMedia
                        component="img"
                        alt={monarch?.imageCaption}
                        src={monarch?.imageUrl}
                        sx={{width: '100px', maxHeight: '200px'}}>
                    </CardMedia>
                    <Stack>
                        <DisplayName monarch={monarch} type={type} displayCrown={true}/>
                        <Typography variant="body2" component="div">
                            {mergeTwoDates(monarch.birth, monarch.death) + lifeTime(monarch.birth, monarch.death)}
                            {/*Birth: {monarch?.birth === null ? 'NA' : monarch?.birth.getFullYear()}<br/>*/}
                            {/*Death: {(monarch?.death === null ? 'NA' : monarch?.death.toLocaleDateString("en-US")) + lifeTime(monarch?.birth, monarch?.death)}<br/>*/}
                            <br/>
                        </Typography>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    )


export default FamilyMemberCard