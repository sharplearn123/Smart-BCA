import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
	sendEmailVerification,
	signOut,
	onAuthStateChanged,
	sendPasswordResetEmail,
} from 'firebase/auth';

import { getFirestore, getDoc, setDoc, doc } from 'firebase/firestore';

const database = getFirestore();
// collection ref

const auth = getAuth();

const user_details = JSON.parse(localStorage.getItem('user_details'));

async function handleLoginForm(e, setMsg, setIsApiLoading) {
	e.preventDefault();
	const registration_no = e.target.registration_no.value;
	const password = e.target.password.value;

	if (!registration_no || !password) return setMsg('Please Enter Your Email and Password');
	setIsApiLoading(true);

	const docRef = doc(database, 'user_info', registration_no);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		signInWithEmailAndPassword(auth, docSnap?.data()?.email, password)
			.then((cred) => {
				localStorage.setItem('user_profile_img', cred?.user?.photoURL);
				localStorage.setItem(
					'user_details',
					JSON.stringify({
						userName: cred?.user?.displayName,
						email: docSnap.data()?.email,
						registration_no: docSnap.data()?.registration_no,
						userId: cred?.user?.uid,
					})
				);
				setIsApiLoading(false);
				document.location.href = '/home';
			})
			.catch((err) => {
				setIsApiLoading(false);
				setMsg(err.code);
				console.log(err.code);
			});
	} else {
		console.log('registration_no not found');
		setMsg('registration_no not found');
	}
}

async function handleSignUpForm(e, setMsg, setIsApiLoading) {
	e.preventDefault();

	const registration_no = e.target.registration_no.value;
	const email = e.target.email.value;
	const password = e.target.password.value;
	const confPassword = e.target.confPassword.value;
	const userName = e.target.userName.value;

	if (!email || !password || !confPassword || !userName || !registration_no) return setMsg('Please enter all data');
	if (password !== confPassword) return setMsg("Passwords didn't match.");

	setIsApiLoading(true);

	const docRef = doc(database, 'user_info', registration_no);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		setMsg('This Registration No. already exists');
		console.log('This Registration No. already exists');
	} else {
		createUserWithEmailAndPassword(auth, email, password)
			.then((cred) => {
				sendEmailVerification(cred.user).then(() => {
					setMsg('Email verification sent. Please also check in spam');
					console.log('Email verification sent. Please also check in spam');
				});

				updateProfile(cred.user, { displayName: userName })
					.then(() => {
						setIsApiLoading(false);
					})
					.catch((err) => {
						setIsApiLoading(false);
						setMsg(err.code);
					});

				setDoc(doc(database, 'user_info', registration_no), { userName, registration_no, email, password })
					.then(() => {
						localStorage.setItem(
							'user_details',
							JSON.stringify({ userName, email, registration_no, userId: cred?.user?.uid, })
						);
						document.location.href = '/home';
					})
					.catch((err) => {
						setIsApiLoading(false);

						setMsg(err.code);
					});
			})
			.catch((err) => {
				console.log(err.code);
				setMsg(err.code);
				setIsApiLoading(false);
			});
	}
}

function handleSignOut() {
	signOut(auth)
		.then(() => {
			localStorage.clear();
			document.location.href = '/';
		})
		.catch((err) => {
			console.log(err.code);
			alert(err.code);
		});
}

async function handleForgetPassword(e, setMsg, setIsOTPApiLoading) {
	e.preventDefault();

	let email = e.target.email.value;
	const registration_no = e.target.registration_no.value;
	if (!email && !registration_no) return setMsg('Please enter email or registration no.');

	setIsOTPApiLoading(true);

	if (registration_no) {
		const docRef = doc(database, 'user_info', registration_no);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			email = docSnap.data()?.email;
		} else {
			setIsOTPApiLoading(false);
			setMsg('Registration no. not found');
			console.log('Registration no. not found');
			return;
		}
	}

	var maskid = email.replace(/^(.)(.*)(.@.*)$/, (_, a, b, c) => a + b.replace(/./g, '*') + c);

	sendPasswordResetEmail(auth, email)
		.then(() => {
			setIsOTPApiLoading(false);
			setMsg('Password reset email sent to (' + maskid + '). Please also check spam');
		})
		.catch((error) => {
			setIsOTPApiLoading(false);
			setMsg(error.code);
			console.log(error.code);
		});
}

function handleUserState(currentPage) {
	if (!currentPage) return console.log('Missing currentPage');

	onAuthStateChanged(auth, (user) => {
		if (currentPage === 'loginPage' && user !== null) {
			document.location.href = '/home';
		} else if (user_details?.email !== user?.email || user_details?.userId !== user?.uid) {
			handleSignOut();
		} else if ((currentPage === 'homePage' && user === null) || (currentPage === 'settingsPage' && user === null)) {
			handleSignOut();
		}
	});
}

export { handleSignUpForm, handleLoginForm, handleSignOut, handleUserState, handleForgetPassword };
