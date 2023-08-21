import React, { useState, useEffect, useCallback } from 'react';
import { handleUserState } from '../firebase/auth';
import { getAllTableData, addNewCourse, updateCourseDetails, deleteData } from '../firebase//home.js';

import NavBar from '../components/Bar/NavBar/NavBar';
import FootBar from '../components/Bar/Footer/Footer';
import Loader from '../components/Loader/Loader';
import ShowMsg from '../components/ShowMsg/ShowMsg.js';
import Table from '../components/Table/Table.js';

import ConfirmationDialog from '../components/ConfirmationDialog/ConfirmationDialog.js';
import Toolbar from '@mui/material/Toolbar';

import '../styles/homePage.css';

const array = JSON.parse(process.env.REACT_APP_SUPER_USER);
let supurUser = array.find(function (element) {
	return element === parseInt(JSON.parse(localStorage.getItem('user_details'))?.registration_no);
});

function HomePage() {
	const [msg, setMsg] = useState({ text: '', type: '' });
	const [isGetLoading, setIsGetLoading] = useState(false);
	const [tableAllData, setTableAllData] = useState([]);
	const [openModal, setOpenModal] = useState(false);

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
				<Table
					tableAllData={tableAllData}
					isGetLoading={isGetLoading}
					supurUser={supurUser ? true : false}
					openModal={openModal}
					tableTitle={
						supurUser
							? ['Subject', 'PPT', 'Books', 'Syllabus', 'Edit/Add']
							: ['Subject', 'PPT', 'Books', 'Syllabus']
					}
				/>
			</div>

			{/* <FootBar /> */}
			{msg && <ShowMsg isError={msg?.text ? true : false} msgText={msg?.text} type={msg?.type} />}
		</>
	);
}

export default HomePage;
