import React, {useContext} from 'react';
import {Monarch} from "../../utils/types";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import {Link, Stack, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";

interface Props {
    monarch: Monarch | null;
    type: string;
    displayCrown: boolean;
    crownOnClick?: () => void; // Make it optional
}

const DisplayName = ({
                         monarch,
                         type,
                         displayCrown,
                         crownOnClick = () => {}, // Default to no-op function
                     }: Props) => {

    const navigate = useNavigate();

    const handleClick = () => {
        if (!monarch) return;
        navigate(`/noble/${monarch.id}`);
    };

    return (<>
        <Typography variant={'body2'} sx={{color: 'text.secondary'}}>{type}</Typography>
        <Stack direction={'row'}>
            <StarOutlineIcon
                sx={{display: monarch && displayCrown && monarch.reigns?.length > 0 ? 'inline' : 'none'}}
                onClick={crownOnClick}
            />
            <Typography variant="body1" component="div">
                <Link
                    sx={{cursor: 'pointer', textDecoration: 'underline'}}
                    onClick={handleClick}
                >
                    {monarch?.name}
                </Link>
            </Typography>
        </Stack>
    </>);
};

export default DisplayName;