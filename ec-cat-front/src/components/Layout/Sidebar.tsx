import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  Toolbar,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Theme,
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { NavItem } from '../../types';

interface SidebarProps {
  drawerWidth: number;
  open: boolean;
  handleDrawerToggle: () => void;
  toggleDrawer: (newOpen: boolean) => () => void;
}

const navItems: NavItem[] = [
  { title: 'Orders', path: '/', icon: 'receipt' },
  { title: 'Products', path: '/products', icon: 'inventory' },
  { title: 'Customers', path: '/customers', icon: 'people' },
  { title: 'Reports', path: '/reports', icon: 'barChart' },
  { title: 'Settings', path: '/settings', icon: 'settings' },
];

const getIcon = (icon: string) => {
  switch (icon) {
    case 'receipt':
      return <ReceiptIcon />;
    case 'inventory':
      return <InventoryIcon />;
    case 'people':
      return <PeopleIcon />;
    case 'barChart':
      return <BarChartIcon />;
    case 'settings':
      return <SettingsIcon />;
    default:
      return <ReceiptIcon />;
  }
};

const Sidebar: React.FC<SidebarProps> = ({ drawerWidth, open, handleDrawerToggle,toggleDrawer}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  // Determine if a nav item is active
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    if (isMobile) {
      handleDrawerToggle();
    }
  };

  const drawerContent = (
    <>

      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={isActive(item.path)}
              onClick={() => handleNavClick(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main',
                  },
                },
              }}
            >
              <ListItemIcon>{getIcon(item.icon)}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      aria-label="mailbox folders"
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>
      
      {/* Desktop permanent drawer */}
      <Drawer
        open={open}
        variant="temporary"
        onClose={toggleDrawer}
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;