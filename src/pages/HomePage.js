import React, { useState, useEffect, useCallback } from 'react';
import { handleUserState } from '../firebase/auth';
import { getAllTableData, addNewCourse, updateCourseDetails, deleteData } from '../firebase//home.js';

import NavBar from '../components/Bar/NavBar/NavBar';
import FootBar from '../components/Bar/Footer/Footer';
import MuiBtn from '../components/EnrollBtn/MuiBtn.js';
import ModalWrapper from '../components/Modal/ModalWrapper.js';
import Loader from '../components/Loader/Loader';
import ShowMsg from '../components/ShowMsg/ShowMsg.js';
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

				<div className="subjectTable">
					<div className="tableRow  titleRow">
						<div className="column_1">Subject</div>
						<div className="column_2">PPT</div>
						<div className="column_3">Syllabus </div>
						<div className="column_4">Books</div>
					</div>
					<Loader isLoading={isGetLoading} />
					{tableAllData.map((item, index) => (
						<div className="tableRow" key={index}>
							<div className="column_1">{item?.subject}</div>
							<div className="column_2">{item?.ppt}</div>
							<div className="column_3">{item?.syllabus} </div>
							<div className="column_4">{item?.books}</div>
						</div>
					))}
				</div>
			</div>

			{/* <FootBar /> */}
			{msg && <ShowMsg isError={msg?.text ? true : false} msgText={msg?.text} type={msg?.type} />}
		</>
	);
}

export default HomePage;
