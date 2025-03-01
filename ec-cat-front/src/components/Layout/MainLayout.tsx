import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  CssBaseline,
  Toolbar,
  Container,
} from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
  [theme.breakpoints.up('md')]: {
    marginLeft: 0,
  },
}));

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [open, setOpen] = useState(true);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* App Bar */}
      <Header 
        drawerWidth={drawerWidth} 
        open={open} 
        handleDrawerToggle={handleDrawerToggle} 
      />
      
      {/* Sidebar */}
      <Sidebar 
        drawerWidth={drawerWidth} 
        open={open}
        handleDrawerToggle={handleDrawerToggle} 
        toggleDrawer={toggleDrawer} 
      />
      
      {/* Main Content */}
      <Main open={open}>
        <Toolbar /> {/* Spacer to offset content below app bar */}
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          {children}
        </Container>
      </Main>
    </Box>
  );
};

export default MainLayout;