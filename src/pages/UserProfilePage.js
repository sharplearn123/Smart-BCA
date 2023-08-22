import React, { useCallback, useEffect, useState } from 'react';
import { handleUserState } from '../firebase/auth';
import { getSearchedUser } from '../firebase/userProfile.js';

import NavBar from '../components/Bar/NavBar/NavBar';
import Footer from '../components/Bar/Footer/Footer';
import ShowMsg from '../components/ShowMsg/ShowMsg.js';
import Loader from '../components/Loader/Loader.js';

import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import IosShareIcon from '@mui/icons-material/IosShare';
import defultProfilePicture from '../images/defultProfilePicture.jpeg';

import '../styles/userProfilePage.css';

function UserProfilePage() {
	const [msg, setMsg] = useState({ text: '', type: '' });
	const [searchedUserData, setSearchedUserData] = useState();
	const [isGetApiLoading, setIsGetApiLoading] = useState(false);
	const [shareBtnTooltip, setShareBtnTooltip] = useState('Click to Copy');

	const handleMsgShown = useCallback((msgText, type) => {
		if (msgText) {
			setMsg({ text: msgText, type: type });
			setTimeout(() => {
				setMsg({ text: '', type: '' });
			}, 2500);
		} else {
			console.log('Please Provide Text Msg');
		}
	}, []);

	useEffect(() => {
		handleUserState(true);
		const searchRegistrationNo = window.location?.pathname?.split('/')?.[2];
		getSearchedUser(searchRegistrationNo, setSearchedUserData, handleMsgShown, setIsGetApiLoading);
		document.title = 'SmartBCA | Search';
	}, [handleMsgShown]);

	const handleShareBtnClick = useCallback(() => {
		navigator.clipboard.writeText(window.location?.href);
		handleMsgShown('Shearing Link Copied', 'success');
		setShareBtnTooltip('Link Copied');
		setTimeout(() => {
			setShareBtnTooltip('Click to Copy');
		}, 2500);
	}, [handleMsgShown]);

	return (
		<>
			<NavBar />
			<div className="userProfilePage">
				<div className="homePageBackground"></div>

				<Toolbar />
				<Loader isLoading={isGetApiLoading} />
				{!isGetApiLoading && (
					<div className="userProfileContainer">
						<img
							src={searchedUserData?.profilePictureUrl || defultProfilePicture}
							className="userProfilePageProfilePic"
							alt="profilePic"
						/>

						<div className="userProfileDetailsBox">
							<div>
								<div className="userProfileRegitrationNo userProfileDetails">
									<span>Regitration No: </span>
									{searchedUserData?.registration_no}
								</div>
								<div className="userProfileDetails">
									<span>Name: </span>
									{searchedUserData?.userName}
								</div>
							</div>
							<div>
								<Tooltip title={<span className="shareBtnTooltip">{shareBtnTooltip}</span>} arrow>
									<IconButton aria-label="share" size="large" onClick={handleShareBtnClick}>
										<IosShareIcon />
									</IconButton>
								</Tooltip>
							</div>
						</div>
					</div>
				)}
				{msg && <ShowMsg isError={msg?.text ? true : false} msgText={msg?.text} type={msg?.type} />}
			</div>
			<Footer />
		</>
	);
}

export default UserProfilePage;
