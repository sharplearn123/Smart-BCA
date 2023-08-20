import React, { useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { handleForgetPassword } from '../firebase/auth';
import Loader from '../components/Loader/Loader';

import '../styles/loginPage.css';

document.title = 'SmartBCA | Forget Password';

function ForgetPasswordPage() {
	const [msg, setMsg] = useState('');
	const [isOTPApiLoading, setIsOTPApiLoading] = useState(false);

	const handleForgetPasswordSubmit = useCallback((e) => {
		handleForgetPassword(e, setMsg, setIsOTPApiLoading);
	}, []);

	const handleMsgHideOnKeyUp = useCallback((e) => {
		setMsg('');
	}, []);

	return (
		<div id="forgetPassPage">
			<div id="wrapper">
				<div id="Title">Forget Password</div>
				<form className="form" onSubmit={handleForgetPasswordSubmit}>
					<input
						type="email"
						name="email"
						className="inputBottomMargin"
						placeholder="Email"
						onChange={handleMsgHideOnKeyUp}
					/>
					<b style={{ marginBottom: '15px' }}>OR</b>

					<input
						type="number"
						name="registration_no"
						placeholder="Registration No."
						className="inputBottomMargin"
						onKeyDown={handleMsgHideOnKeyUp}
					/>
					<button id="createAcc" style={{ marginTop: 'unset' }}>
						Send Link
					</button>

					<div className="red">{msg}</div>
					<Loader isLoading={isOTPApiLoading} />
					<br />
				</form>

				<NavLink to="/" id="forgotPass">
					Back to Login Page
				</NavLink>
			</div>
		</div>
	);
}

export default ForgetPasswordPage;
