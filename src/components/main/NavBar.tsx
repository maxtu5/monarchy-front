import React from 'react';
import {AppBar, Box, Toolbar, Typography} from "@mui/material";
import {Link, useLocation} from "react-router-dom";

interface NavBarItemProps {
    label: string;
    to: string;
}

function NavBarItem({ label, to }: NavBarItemProps) {
  const location = useLocation();
    const active = label==="Main" ? location.pathname==='/' : location.pathname.startsWith(to.substring(0, to.length-1));

    return (
        <Box
            component={Link}
            to={to}
            sx={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                px: 2
            }}
        >
            <Typography
                variant="body1"
                sx={{
                    fontWeight: active ? "bold" : "normal",
                    mb: 0.5
                }}
            >
                {label}
            </Typography>

            <Box
                sx={{
                    width: "100%",
                    height: 6,
                    borderTopLeftRadius: 6,
                    borderTopRightRadius: 6,
                    backgroundColor: active ? "#fff" : "rgba(255,255,255,0.4)",
                    transition: "0.2s",
                    "&:hover": {
                        backgroundColor: "#fff"
                    }
                }}
            />
        </Box>
    );
}

function NavBar() {
    return (
        <AppBar position="relative" sx={{backgroundColor: "#888"}}>
            <Toolbar sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'stretch'}}>

                <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                    <Link to="/" style={{display: "flex", alignItems: "center"}}>
                        <img
                            src="/monarchy/logo512.png"
                            alt="Monarchy Logo"
                            style={{width: 40, height: 40, cursor: "pointer"}}
                        />
                    </Link>
                    <Typography variant="h6">THE ROYAL MONARCHY</Typography>
                </Box>

                <Box sx={{display: 'flex', gap: 3,
                    alignItems: 'flex-end'}}>
                    <NavBarItem label={'Main'} to="/"/>
                    <NavBarItem label={'Thrones'} to="/thrones"/>
                    <NavBarItem label={'Nobles'} to="/nobles"/>
                    <NavBarItem label={'Houses'} to="/houses"/>
                </Box>
            </Toolbar>
        </AppBar>
);
}

export default NavBar;