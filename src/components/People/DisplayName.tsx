import React, {useContext} from 'react';
import {Monarch} from "../../utils/types";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import {Link, Stack, Typography} from "@mui/material";
import {loadMonarch} from "../../fetchers/MonarchFetcher";
import {KingdomContext} from "../../utils/context";

interface Props {
    monarch: Monarch | null,
    type: string,
    displayCrown: boolean
}

const DisplayName = ({monarch, type, displayCrown}: Props) => {
    const {setMonarch, setMode} = useContext(KingdomContext)
    return (
        <span>
            <Typography sx={{color: 'text.secondary'}}>{type}</Typography>
            <Stack direction={'row'}>
                <StarOutlineIcon
                    // @ts-ignore
                    sx={{display: (displayCrown && (monarch.reigns.length > 0)) ? '' : "none"}}/>
                <Typography variant="body1" component="div">
                    <Link onClick={async () => {
                        // @ts-ignore
                        const retval: Monarch | null = await loadMonarch(monarch.id);
                        if (retval !== null) {
                            setMonarch(retval);
                            setMode(2)
                        }
                    }}>
                        {monarch?.name}
                    </Link>
                </Typography>
            </Stack>
        </span>
    );
};

export default DisplayName;