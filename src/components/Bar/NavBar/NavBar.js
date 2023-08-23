import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import { handleSignOut } from '../../../firebase/auth';
import UserSearchBox from '../../UserSearchBox/UserSearchBox';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Logout from '@mui/icons-material/Logout';
import Settings from '@mui/icons-material/Settings';

import logoSizeM from '../../../images/logoSizeL.png';
import defultProfilePicture from '../../../images/defultProfilePicture.jpeg';

import './navBar.css';

function NavBar() {
	const [settingMenuAnchorEl, setSettingMenuAddNotesAnchorEl] = useState(null);
	const [isbarScrolled, setIsbarScrolled] = useState(false);
	const profilePictureUrl = localStorage.getItem('user_profile_img') || defultProfilePicture;

	const listenScrollEvent = (event) => {
		if (window.scrollY < 15) {
			return setIsbarScrolled(false);
		} else if (window.scrollY > 15) {
			return setIsbarScrolled(true);
		}
	};

	useEffect(() => {
		window.addEventListener('scroll', listenScrollEvent);
		return () => window.removeEventListener('scroll', listenScrollEvent);
	}, []);

	const isSettingsAnchorElopen = Boolean(settingMenuAnchorEl);

	const toggleSettingsMenu = (event) => {
		setSettingMenuAddNotesAnchorEl(event.currentTarget);
	};

	const handleLogoutBtnClick = useCallback(() => {
		localStorage.clear();
		handleSignOut();
	}, []);

	return (
		<>
			<AppBar
				sx={isbarScrolled ? { bgcolor: null, minHeight: 'unset' } : { bgcolor: 'unset', minHeight: 'unset' }}
			>
				<div className="navBar">
					<NavLink to="/" className="brandName">
						<img src={logoSizeM} alt="" />
						SmartBCA
					</NavLink>

					<UserSearchBox newClass={'navBarSearchBox'} />

					<Box sx={{ display: { display: 'flex', alignItems: 'center' } }}>
						<IconButton
							id="iconMenuBtn"
							color="inherit"
							size="small"
							aria-expanded={isSettingsAnchorElopen ? 'true' : undefined}
							aria-haspopup="true"
							aria-controls={isSettingsAnchorElopen ? 'account-menu' : undefined}
							onClick={toggleSettingsMenu}
							sx={{ borderRadius: '5px', mr: { xs: 0.5, sm: 1 } }}
						>
							<Avatar
								className="defultProfilePicture"
								size="small"
								sx={{ borderRadius: '5px' }}
								src={profilePictureUrl === 'null' ? defultProfilePicture : profilePictureUrl}
								alt="logo"
							/>
						</IconButton>
						<div className="userNavBarDetails">
							<div>{JSON.parse(localStorage.getItem('user_details'))?.registration_no}</div>
							<div>
								{JSON.parse(localStorage.getItem('user_details'))?.userName} <br />
							</div>
						</div>
					</Box>
				</div>
			</AppBar>

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
		</>
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
