import React, { useState, useCallback } from 'react';

import { handleUserNameChange, handleUserProfileChange } from '../../../firebase/settings';

import defultProfilePicture from '../../../images/defultProfilePicture.jpeg';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import './profileSettings.css';

function ProfileSettings() {
	const [imageUpload, setImageUpload] = useState(null);
	const [userName, setUserName] = useState(JSON.parse(localStorage.getItem('user_details'))?.userName || '');
	const [profilePictureUrl, setProfilePictureUrl] = useState(
		localStorage.getItem('user_profile_img') || defultProfilePicture
	);
	const [isSaveBtnLoading, setIsSaveBtnLoading] = useState(false);
	const [msg, setMsg] = useState('');

	const handleUserDetailsChange = useCallback(
		(e) => {
			setUserName(e.target.value);
		},
		[setUserName]
	);

	const handleImageUpload = useCallback(
		(e) => {
			setImageUpload(e.target.files[0]);
		},
		[setImageUpload]
	);

	const handleUserDetailsUpdate = useCallback(() => {
		if (imageUpload) {
			handleUserProfileChange(imageUpload, setProfilePictureUrl, setMsg, setIsSaveBtnLoading);
		}
		handleUserNameChange(userName, setMsg, setIsSaveBtnLoading, imageUpload);
	}, [userName, imageUpload]);

	return (
		<div className="profileSettings">
			<div className="ProfilePictureTitle">Profile Picture</div>
			<div className="userInfo">
				<div>
					<img
						src={imageUpload ? URL.createObjectURL(imageUpload) : profilePictureUrl || defultProfilePicture}
						alt=""
						className="ProfilePictureImg"
					/>
				</div>
				<div className="userDetails">
					<input
						type="file"
						className="ProfilePicUploadBtn"
						accept="image/png, image/gif, image/jpeg"
						onChange={handleImageUpload}
					/>

					<div className="userNameTitle">User Name →</div>
					<div className="userName">
						<input
							className="firstNameInput profileSettingsInput"
							type="text"
							name="userName"
							placeholder="User Name"
							value={userName ? userName : ''}
							onChange={handleUserDetailsChange}
						/>
					</div>

					<div className="saveChangesBtn">
						<Button
							variant="contained"
							color="success"
							id="basic-button"
							aria-haspopup="true"
							onClick={handleUserDetailsUpdate}
							disabled={isSaveBtnLoading}
							sx={{
								fontWeight: 600,
								p: 0,
								height: 40,
								width: 140,
							}}
						>
							{isSaveBtnLoading ? <CircularProgress size={30} /> : ' Save Changes'}
						</Button>
					</div>
				</div>
			</div>
			<div className="changeUserProfileMsg">{msg}</div>
		</div>
	);
}

export default ProfileSettings;
