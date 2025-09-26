import React, {useContext} from 'react';
import {Monarch} from "../../utils/types";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import {Link, Stack, Typography} from "@mui/material";
import {loadMonarch} from "../../fetchers/MonarchFetcher";
import {KingdomContext, ModeContext} from "../../utils/context";

interface Props {
    monarch: Monarch | null,
    type: string,
    displayCrown: boolean
}

const DisplayName = ({monarch, type, displayCrown}: Props) => {
    const {setMode} = useContext(ModeContext)
    const {setMonarch} = useContext(KingdomContext)

    const handleClick = async () => {
        if (!monarch) return;
        const newMonarch = await loadMonarch(monarch.id);
        if (newMonarch) {
            setMonarch(newMonarch);
            setMode(2);
        }
    };

    return (<>
        <Typography variant={'body2'} sx={{color: 'text.secondary'}}>{type}</Typography>
        <Stack direction={'row'}>
            <StarOutlineIcon
                sx={{display: monarch && displayCrown && monarch.reigns?.length > 0 ? 'inline' : 'none'}}
            />
            <Typography variant="body1" component="div">
                <Link
                      sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                      onClick={handleClick}
                >
                    {monarch?.name}
                </Link>
            </Typography>
        </Stack>
    </>);
};

export default DisplayName;