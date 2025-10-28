import React, {useContext, useEffect, useState} from 'react';
import {KingdomContext, ModeContext} from "../../utils/context";
import {Box, Button, Link, Stack, TextField, Typography} from "@mui/material";
import {findMonarchsByName, findMonarchsByYear, loadMonarch} from "../../fetchers/fetchers";
import {Monarch} from "../../utils/types";


function SearchBar() {
    const {setMode} = useContext(ModeContext)
    const {setMonarch} = useContext(KingdomContext)
    const ITEMS_PER_PAGE = 15;

    const [searchTerm, setSearchTerm] = useState('');
    const [searchYear, setSearchYear] = useState('');
    const [debouncedTerm, setDebouncedTerm] = useState('');
    const [debouncedYear, setDebouncedYear] = useState('');    const [monarchs, setMonarchs] = useState<{ id: string; name: string }[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

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
            findMonarchsByYear(year).then((results) => {
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
        <Box>
            <TextField
                label="Search Monarchs"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Search by Year"
                variant="outlined"
                type="number"
                value={searchYear}
                onChange={(e) => setSearchYear(e.target.value)}
                fullWidth
                margin="normal"
            />
            <Box mt={2}>
                {paginatedMonarchs.length === 0 ? (
                    <Typography>No monarchs found.</Typography>
                ) : (
                    paginatedMonarchs.map((monarch) => (
                        <Typography key={monarch.id}>

                            <Link onClick={async () => {
                                // @ts-ignore
                                const retval: Monarch | null = await loadMonarch(monarch.id);
                                if (retval !== null) {
                                    setMonarch(retval);
                                    setMode(2)
                                }
                            }}>

                            {monarch.name}
                            </Link>
                        </Typography>
                    ))
                )}
            </Box>

            {totalPages > 1 && (
                <Stack direction="row" spacing={2} mt={2}>
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