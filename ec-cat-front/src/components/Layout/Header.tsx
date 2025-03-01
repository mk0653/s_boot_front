import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Badge,
  Avatar,
  useMediaQuery,
  Theme,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';

interface HeaderProps {
  drawerWidth: number;
  open: boolean;
  handleDrawerToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ drawerWidth, open, handleDrawerToggle }) => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100%px)` },
        ml: { md: `${drawerWidth}px` },
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: 1,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        {/* ハンバーガーメニュートグルボタン */}
        <IconButton
          color="inherit"
          aria-label="toggle drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2 }}
        >
          {open ? <MenuIcon /> : <MenuIcon />}
        </IconButton>

        <Toolbar>
        {/* Logo or branding can go here */}
        <Box sx={{ display: 'flex', alignItems: 'center',flexGrow: 1 }}>
          <Box
            component="img"
            src="/logo.png"
            alt="EC-Cat"
            sx={{ height: 40, mr: 1, display: { xs: 'none', sm: 'block' } }}
          />
          <Box sx={{ typography: 'h6', fontWeight: 'bold', color: 'primary.main' }}>
            EC-Cat
          </Box>
        </Box>
        </Toolbar>
        {/* タイトル */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Page title - shown only on mobile when drawer is closed */}
        {isMobile && !open && (
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            EC-Cat
          </Typography>
        )}
      
        <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
          {/* Notifications */}
          <IconButton color="inherit" sx={{ ml: 1 }}>
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* User avatar */}
          <IconButton sx={{ ml: 1, p: 0 }}>
            <Avatar alt="User" src="/static/images/avatar/1.jpg" />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;