import React, { useState, useEffect, useCallback } from 'react';
import { handleUserState } from '../firebase/auth';
import { getAllTableData, addNewCourse, updateCourseDetails, deleteData } from '../firebase//home.js';

import NavBar from '../components/Bar/NavBar/NavBar';
import FootBar from '../components/Bar/Footer/Footer';
import MuiBtn from '../components/EnrollBtn/MuiBtn.js';
import ModalWrapper from '../components/Modal/ModalWrapper.js';
import Loader from '../components/Loader/Loader';
import ShowMsg from '../components/ShowMsg/ShowMsg.js';
import Table from '../components/Table/Table.js';

import ConfirmationDialog from '../components/ConfirmationDialog/ConfirmationDialog.js';
import Toolbar from '@mui/material/Toolbar';

import '../styles/homePage.css';

import photoNotAvailable from '../images/photoNotAvailable.jpeg';

function HomePage() {
	const [msg, setMsg] = useState({ text: '', type: '' });
	const [isGetLoading, setIsGetLoading] = useState(false);
	const [tableAllData, setTableAllData] = useState([]);

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
		handleUserState('homePage');
		document.title = 'SmartBCA | Home ';
		getAllTableData(setTableAllData, setIsGetLoading, handleMsgShown);
	}, [handleMsgShown]);
	return (
		<>
			<NavBar />
			<div className="homePageBackground"></div>

			<div className="homePageContain" component="main">
				<Toolbar />
				<div className="homePageTitle">
					<div className="programName">
						Program code and Name:- <span>P129 :: BCA</span>{' '}
					</div>
					<div className="classSection">
						Section:- <span>D2308</span>
					</div>
				</div>
				<Table tableAllData={tableAllData} isGetLoading={isGetLoading} />
			</div>

			{/* <FootBar /> */}
			{msg && <ShowMsg isError={msg?.text ? true : false} msgText={msg?.text} type={msg?.type} />}
		</>
	);
}

export default HomePage;
