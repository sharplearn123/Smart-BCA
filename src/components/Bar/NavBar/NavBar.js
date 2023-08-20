import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import { handleSignOut } from '../../../firebase/auth';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
// import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Logout from '@mui/icons-material/Logout';
import Settings from '@mui/icons-material/Settings';

import logoSizeM from '../../../images/logoSizeL.png';

import './navBar.css';

const drawerWidth = 240;

function NavBar({ handleModalToggle }, props) {
	const { window } = props;
	const [mobileOpen, setMobileOpen] = useState(false);
	const [settingMenuAnchorEl, setSettingMenuAddNotesAnchorEl] = useState(null);

	const isSettingsAnchorElopen = Boolean(settingMenuAnchorEl);

	const container = window !== undefined ? () => window().document.body : undefined;

	const handleDrawerToggle = () => {
		setMobileOpen((prevState) => !prevState);
	};

	const toggleSettingsMenu = (event) => {
		setSettingMenuAddNotesAnchorEl(event.currentTarget);
	};

	const handleLogoutBtnClick = useCallback(() => {
		localStorage.clear();
		handleSignOut();
	}, []);

	const [settingsDrawerMenu, setSettingsDrawerMenu] = useState([
		{
			name: 'Home',
			isSelected: true,
			icon: <HomeIcon />,
			// page: <ProfileSettings />,
		},
		{
			name: 'Courses',
			isSelected: false,
			icon: <MenuBookIcon />,
			// page: <AccountSettings />,
		},
		{
			name: 'Add New Course',
			isSelected: false,
			icon: <ShoppingCartOutlinedIcon />,
			click: () => {
				return handleModalToggle('create');
			},
		},
	]);

	const drawer = (
		<Box sx={{ textAlign: 'center' }}>
			<Typography variant="h6" className="brandName" sx={{ my: 2, justifyContent: 'center' }}>
				SmartBCA
			</Typography>
			<Divider />
			<List>
				{settingsDrawerMenu.map((item, index) => (
					<ListItem
						onClick={item?.click ? item.click : handleDrawerToggle}
						key={index}
						selected={item.isSelected}
						disablePadding
					>
						<ListItemButton sx={{ py: 1.7, pl: 4 }}>
							<ListItemIcon>{item.icon}</ListItemIcon>
							<ListItemText primary={item.name} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Box>
	);

	return (
		<Box sx={{ display: 'flex' }}>
			{/* <CssBaseline /> */}
			<AppBar sx={{ bgcolor: 'unset' }}>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						onClick={handleDrawerToggle}
						sx={{ mr: 2, display: { sm: 'none' } }}
					>
						<MenuIcon />
					</IconButton>

					<div className="brandName">
						<IconButton
							id="iconMenuBtn"
							color="inherit"
							size="small"
							aria-expanded={isSettingsAnchorElopen ? 'true' : undefined}
							aria-haspopup="true"
							aria-controls={isSettingsAnchorElopen ? 'account-menu' : undefined}
							onClick={toggleSettingsMenu}
							sx={{ mr: 1, display: { xs: 'none', sm: 'block' } }}
						>
							<Avatar alt="Remy Sharp" src={logoSizeM} />
						</IconButton>{' '}
						SmartBCA
					</div>
					<Button
						className="phoneAddNewCourse"
						variant="contained"
						onClick={() => handleModalToggle('create')}
						sx={{ px: 1, display: { xs: 'flex', sm: 'none' } }}
					>
						Add New Course
					</Button>

					<Box sx={{ display: { xs: 'none', sm: 'block' } }}>
						{settingsDrawerMenu.map((item, index) => (
							<Button
								key={index}
								variant={item.name === 'Add New Course' ? 'contained' : null}
								sx={item.name === 'Add New Course' ? { ml: 2 } : { color: '#fff' }}
								onClick={item?.click ? item.click : null}
							>
								{item.name}
							</Button>
						))}
					</Box>
				</Toolbar>
			</AppBar>

			{/* Phone Menu Drawer ↓ */}
			<Box component="nav">
				<Drawer
					container={container}
					variant="temporary"
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
					sx={{
						display: { xs: 'block', sm: 'none' },
						'& .MuiDrawer-paper': {
							boxSizing: 'border-box',
							width: drawerWidth,
						},
					}}
				>
					{drawer}
				</Drawer>
			</Box>

			{/* settings notes */}
			<Menu
				anchorEl={settingMenuAnchorEl}
				id="account-menu"
				open={isSettingsAnchorElopen}
				onClose={() => setSettingMenuAddNotesAnchorEl(null)}
				onClick={() => setSettingMenuAddNotesAnchorEl(null)}
				PaperProps={{
					sx: {
						overflow: 'visible',
						filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
						mt: 1,
						'& .MuiMenuItem-root': {
							height: 45,
						},
						'&:before': {
							content: '""',
							display: 'block',
							position: 'absolute',
							top: 0,
							left: 20,
							width: 10,
							height: 10,
							bgcolor: '#121212',
							backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12))',
							transform: 'translateY(-50%) rotate(45deg)',
							zIndex: 0,
						},
					},
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
				<NavLink to="/Settings" style={{ color: 'unset', textDecoration: 'unset' }}>
					<MenuItem>
						<ListItemIcon>
							<Settings fontSize="small" />
						</ListItemIcon>
						Settings
					</MenuItem>
				</NavLink>
				<MenuItem onClick={handleLogoutBtnClick}>
					<ListItemIcon>
						<Logout fontSize="small" />
					</ListItemIcon>
					Logout
				</MenuItem>
			</Menu>
		</Box>
	);
}

NavBar.propTypes = {
	/**
	 * Injected by the documentation to work in an iframe.
	 * You won't need it on your project.
	 */
	window: PropTypes.func,
};

export default NavBar;
