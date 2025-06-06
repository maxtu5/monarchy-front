import React, {useContext} from 'react';
import {DataGrid, GridColDef, GridEventListener} from '@mui/x-data-grid';
import {Monarch, Reign, ThroneDetails} from "../utils/types";
import {Box} from '@mui/material';
import {KingdomContext} from "../utils/context";
import {loadMonarch} from "../fetchers/MonarchFetcher";

interface Props {
    detailsData: ThroneDetails | null,
    setValue: (value: number) => void
}

function ThroneMonarchsTable({detailsData, setValue}: Props) {
    const {setMonarch} = useContext(KingdomContext)

    const columns: GridColDef[] = [
        {field: 'id', headerName: 'Reignid', width: 50},
        {field: 'monarchId', headerName: 'Monarchid', width: 50},
        {field: 'name', headerName: 'Name', width: 170},
        {field: 'title', headerName: 'Title', width: 170},
        {field: 'reign', headerName: 'Reign', width: 170},
        {field: 'life', headerName: 'Life', width: 170},
    ];

    function mergeTwoDates(start: Date | null, end: Date | null): string {
        const first = start == null ? 'NA' : start.toString().slice(0, 4)
        const last = end == null ? 'NA' : end.toString().slice(0, 4)
        return '(' + first + ' - ' + last + ')'
    }

    const rows = detailsData?.restMonarchs.map((rm) => {
        return {
            id: rm.reign.id,
            monarchId: rm.monarch.id,
            name: rm.monarch.name,
            title: rm.reign.title,
            reign: mergeTwoDates(rm.reign.start, rm.reign.end),
            life: mergeTwoDates(rm.monarch.birth, rm.monarch.death)
        }
    })

    const handleRowClick: GridEventListener<'rowClick'> = async (params) => {

        const retval: Monarch | null = await loadMonarch(`${params.row.monarchId}`)
        if (retval !== null) {
            setMonarch(retval)
            setValue(2)
        }
    };

    return (
        <div>
            <Box sx={{height: 400, width: '100%'}}>

                <DataGrid
                    rows={rows}
                    columns={columns}
                    onRowClick={handleRowClick}
                    // initialState={{ pagination: p}
                    pageSizeOptions={[5, 10]}
                    sx={{border: 0}}
                />
            </Box>
        </div>
    );
}

export default ThroneMonarchsTable;