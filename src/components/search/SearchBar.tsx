import React, {useEffect, useState} from 'react';
import {Box, Button, Divider, Link, Stack, TextField, Typography} from "@mui/material";
import {findMonarchsByName, findMonarchsByYear} from "../../fetchers/fetchersMonarchs";

import {useNavigate} from "react-router-dom";


function SearchBar() {
    const ITEMS_PER_PAGE = 15;

    const [searchTerm, setSearchTerm] = useState('');
    const [searchYear, setSearchYear] = useState('');
    const [debouncedTerm, setDebouncedTerm] = useState('');
    const [debouncedYear, setDebouncedYear] = useState('');    const [monarchs, setMonarchs] = useState<{ id: string; name: string }[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedTerm(searchTerm);
            setDebouncedYear(searchYear);
        }, 700);

        return () => {
            clearTimeout(handler); // cancel previous timer if user types again
        };
    }, [searchTerm, searchYear]);

    useEffect(() => {
        const term = debouncedTerm.trim();
        const year = debouncedYear.trim();

        if (term) {
            findMonarchsByName(term).then((results) => {
                setMonarchs(results);
                setCurrentPage(1);
            });
        } else if (year) {
            findMonarchsByYear(year, 0, 1000).then((results) => {
                setMonarchs(results);
                setCurrentPage(1);
            });
        }
    }, [debouncedTerm, debouncedYear]);

    // Pagination logic
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedMonarchs = monarchs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const totalPages = Math.ceil(monarchs.length / ITEMS_PER_PAGE);

    return (
        <Box sx={{p:1, m:1, bgcolor: '#ddd'}}>
            <Box sx={{display: "flex", justifyContent: "space-between", m: 1}}>
                <Typography variant={'h5'}>Search nobles</Typography>
            </Box>
            <Divider sx={{mb: 0}}/>
            <TextField
                label="Search Monarchs"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                margin="normal"
                size={'small'}
            />
            <TextField
                label="Search by Year"
                variant="outlined"
                type="number"
                value={searchYear}
                onChange={(e) => setSearchYear(e.target.value)}
                fullWidth
                margin="normal"
                size={'small'}
            />
            <Box sx={{mt:2}}>
                {paginatedMonarchs.length === 0 ? (
                    <Typography>No monarchs found.</Typography>
                ) : (
                    paginatedMonarchs.map((monarch) => (
                        <Typography key={monarch.id}>
                            <Link onClick={ () => navigate(`/noble/${monarch.id}`) }>
                                {monarch.name}
                            </Link>
                        </Typography>
                    ))
                )}
            </Box>

            {totalPages > 1 && (
                <Stack direction="row" spacing={2} sx={{mt:2}}>
                    <Button
                        variant="contained"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                        Previous
                    </Button>
                    <Typography>Page {currentPage} of {totalPages}</Typography>
                    <Button
                        variant="contained"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                        Next
                    </Button>
                </Stack>
            )}

        </Box>
    );
}

export default SearchBar;