import { storage } from './initFirebase';

import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updateProfile, updatePassword } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, getFirestore } from 'firebase/firestore';

const auth = getAuth();
// const storage = getStorage(app);
const database = getFirestore();

async function handleUserNameChange(userName, setMsg, setIsSaveBtnLoading, imageUpload) {
	if (!userName.trim()) return setMsg('User Name can not be empty');
	const user = auth.currentUser;
	if (userName === user.displayName) return;
	if (!imageUpload) setIsSaveBtnLoading(true);

	updateProfile(user, { displayName: userName.trim() })
		.then(() => {
			const oldData = JSON.parse(localStorage.getItem('user_details'));
			const docRef = doc(database, 'user_info', oldData?.registration_no);
			updateDoc(docRef, {
				userName: userName.trim(),
			})
				.then(() => {
					localStorage.setItem('user_details', JSON.stringify({ ...oldData, userName }));
					setMsg('Changed successfully');
					if (!imageUpload) setIsSaveBtnLoading(false);
				})
				.catch((err) => {
					console.log(err.code);
					setMsg(err.code);
				});
		})
		.catch((err) => {
			setMsg(err.code);
			if (!imageUpload) setIsSaveBtnLoading(false);
			console.log(err.message);
		});
}

function handleUserProfileChange(imageUpload, setProfilePictureUrl, setMsg, setIsSaveBtnLoading) {
	setIsSaveBtnLoading(true);
	const imageRef = ref(
		storage,
		'profilePicture/' + auth.currentUser.uid + '/' + auth.currentUser.displayName.split(' ')[0] + '_profilePicture'
	);

	uploadBytesResumable(imageRef, imageUpload)
		.then((snapshot) => {
			setIsSaveBtnLoading(false);
			console.log('Uploaded successfully a blob or file!');
			console.log(snapshot);

			getDownloadURL(snapshot.ref)
				.then((downloadURL) => {
					setProfilePictureUrl(downloadURL);
					localStorage.setItem('user_profile_img', downloadURL);

					try {
						const oldData = JSON.parse(localStorage.getItem('user_details'));
						const docRef = doc(database, 'user_info', oldData?.registration_no);
						updateDoc(docRef, {
							profilePictureUrl: downloadURL,
						});
					} catch (err) {
						console.log(err);
					}

					const user = auth.currentUser;

					updateProfile(user, { photoURL: downloadURL })
						.then(() => {
							setMsg('Changed successfully');
							setIsSaveBtnLoading(false);
						})
						.catch((err) => {
							setMsg(err.code);
							setIsSaveBtnLoading(false);
							console.log(err.message);
						});
				})
				.catch((err) => {
					setIsSaveBtnLoading(false);
					console.log(err.message);
					setMsg(err.code);
				});
		})
		.catch((err) => {
			setIsSaveBtnLoading(false);
			console.log(err.message);
			setMsg(err.code);
		});
}

function handlePasswordChange(changePasswordData, setChangePasswordMsg, setIsChangePasswordBtnLoading) {
	const { currentPassword, newPassword, confPassword } = changePasswordData;
	console.log(changePasswordData);

	if (!currentPassword || !newPassword || !confPassword)
		return setChangePasswordMsg('Please provide all detials'), setIsChangePasswordBtnLoading(false);
	if (newPassword !== confPassword)
		return setChangePasswordMsg('Password does not match.'), setIsChangePasswordBtnLoading(false);
	if (currentPassword.length < 8 || newPassword.length < 8 || confPassword.length < 8)
		return setChangePasswordMsg('Password must be 8 digits.'), setIsChangePasswordBtnLoading(false);

	const user = auth.currentUser;
	const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);

	reauthenticateWithCredential(user, credential)
		.then((cred) => {
			updatePassword(cred.user, newPassword)
				.then(() => {
					setIsChangePasswordBtnLoading(false);
					setChangePasswordMsg('Update successful.');

					try {
						const oldData = JSON.parse(localStorage.getItem('user_details'));
						const docRef = doc(database, 'user_info', oldData?.registration_no);
						updateDoc(docRef, {
							password: newPassword,
						});
					} catch (err) {
						console.log(err);
					}
				})
				.catch((err) => {
					setIsChangePasswordBtnLoading(false);
					setChangePasswordMsg(err.code);
					console.log(err.message);
				});
		})
		.catch((err) => {
			setIsChangePasswordBtnLoading(false);
			setChangePasswordMsg(
				err.code === 'auth/too-many-requests'
					? ' Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.'
					: err.code
			);
			console.log(err.message);
		});
}

export { handleUserNameChange, handlePasswordChange, handleUserProfileChange };
