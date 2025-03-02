import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Avatar,
  useMediaQuery,
  Theme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import Lottie from 'react-lottie';
import catAnimation from '../../assets/cat_walk.json';

interface HeaderProps {
  drawerWidth: number;
  open: boolean;
  handleDrawerToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ drawerWidth, open, handleDrawerToggle }) => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    // Lottieアニメーションの設定
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: catAnimation,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100%)` },
        ml: { md: `${drawerWidth}px` },
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: 1,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        overflow: 'hidden', 
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
         <MenuIcon />
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

        {/* 猫のLottieアニメーション */}
        <Box
          sx={{
            position: 'absolute',
            bottom: '1px',
            left: 0,
            width: '100%',
            height: '50px',
            pointerEvents: 'none', // クリックイベントが下の要素に通過するように
            animation: 'catMove 40s linear infinite',
            '& > div': { height: '100% !important' },
            '@keyframes catMove': {
              '0%': { transform: 'translateX(100vw)' },
              '100%': { transform: 'translateX(-100%)' }
            },
          }}
        >
          <Lottie options={defaultOptions} height={40} width={80} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;