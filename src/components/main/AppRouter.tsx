import AllThronesScreen from "../thrones/AllThronesScreen";
import ThroneScreen from "../thrones/ThroneScreen";
import MonarchScreen from "../nobles/MonarchScreen";
import React from "react";
import {Route, Routes} from "react-router-dom";
import {MainScreen} from "./MainScreen";
import {AllNoblesScreen} from "./AllNoblesScreen";
import {ComingSoonScreen} from "./ComingSoonScreen";
import NavBar from "./NavBar";
import {Box} from "@mui/material";


export default function AppRouter() {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", bgcolor: '#bbb', minHeight: "100vh" }}>
            <NavBar />
            <Routes>
                <Route path="/" element={<MainScreen />} />
                <Route path="/thrones" element={<AllThronesScreen />} />
                <Route path="/throne/:country" element={<ThroneScreen />} />

                <Route path="/nobles" element={<AllNoblesScreen />} />
                <Route path="/noble/:id" element={<MonarchScreen />} />

                <Route path="/houses" element={<ComingSoonScreen />} />
            </Routes>
        </Box>
    )}