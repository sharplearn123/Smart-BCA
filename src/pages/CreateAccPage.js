import React, { useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';

import { handleSignUpForm } from '../firebase/auth';
import Loader from '../components/Loader/Loader';

import '../styles/loginPage.css';

document.title = 'SmartBCA | Register';

function CreateAcc() {
	const [msg, setMsg] = useState('');
	const [isApiLoading, setIsApiLoading] = useState(false);

	const handleUserSignUpForm = useCallback((e) => {
		handleSignUpForm(e, setMsg, setIsApiLoading);
	}, []);

	const handleMsgHideOnKeyUp = useCallback(() => {
		setMsg('');
	}, []);

	return (
		<div id="CreateAccPage">
			<div id="wrapper">
				<div id="Title">Create Your Account</div>

				<form className="form" onSubmit={handleUserSignUpForm}>
					<input
						type="text"
						name="userName"
						placeholder="Full Name"
						className="inputBottomMargin"
						required
						onChange={handleMsgHideOnKeyUp}
					/>

					<input
						type="number"
						name="registration_no"
						placeholder="Registration No."
						className="inputBottomMargin"
						required
						onChange={handleMsgHideOnKeyUp}
					/>

					<input
						type="email"
						name="email"
						placeholder="Email"
						className="inputBottomMargin"
						required
						onChange={handleMsgHideOnKeyUp}
					/>

					<input
						type="Password"
						name="password"
						placeholder="Password (8 digit)"
						pattern="().{8,}"
						className="inputBottomMargin"
						required
						onChange={handleMsgHideOnKeyUp}
					/>

					<input
						type="Password"
						name="confPassword"
						placeholder="Confirm Password (8 digit)"
						pattern="().{8,}"
						className="inputBottomMargin"
						required
						onChange={handleMsgHideOnKeyUp}
					/>

					<button id="signup" className={isApiLoading ? 'isSignup' : ''}>
						Sign Up
					</button>
					<div id="updateMsg" className="red" style={isApiLoading ? { marginBottom: '0px' } : {}}>
						{' '}
						{msg}{' '}
					</div>
				</form>

				<Loader isLoading={isApiLoading} />
				<hr />

				<div id="alreadyAcc" style={isApiLoading ? null : { margin: '25px 0px 5px 0px' }}>
					<NavLink to="/">Already have an Account</NavLink>
				</div>
			</div>
		</div>
	);
}

export default CreateAcc;
