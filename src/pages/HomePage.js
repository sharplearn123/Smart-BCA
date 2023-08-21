import React, { useState, useEffect, useCallback } from 'react';
import { handleUserState } from '../firebase/auth';
import { getAllTableData } from '../firebase//home.js';

import NavBar from '../components/Bar/NavBar/NavBar';
// import FootBar from '../components/Bar/Footer/Footer';
import ShowMsg from '../components/ShowMsg/ShowMsg.js';
import Table from '../components/Table/Table.js';
import Toolbar from '@mui/material/Toolbar';
import SearchIcon from '@mui/icons-material/Search';

import '../styles/homePage.css';

const array = JSON.parse(process.env.REACT_APP_SUPER_USER);
let supurUser = array.find(function (element) {
	return element === parseInt(JSON.parse(localStorage.getItem('user_details'))?.registration_no);
});

function HomePage() {
	const [msg, setMsg] = useState({ text: '', type: '' });
	const [isGetLoading, setIsGetLoading] = useState(false);
	const [tableAllData, setTableAllData] = useState([]);
	const [searchBoxText, setSearchBoxText] = useState('');

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

	const handleSearch = useCallback(() => {
		window.open(searchBoxText, '_self', false);
	}, [searchBoxText]);

	return (
		<>
			<NavBar />
			<div className="homePageBackground"></div>

			<div className="homePageContain" component="main">
				<Toolbar />
				<div className="homePageTitle">
					<div className="classInfo">
						<div className="programName">
							Program code: <span>P124</span>
						</div>
						<div className="programName">
							Program Name: <span>BCA</span>
						</div>
						<div className="programName">
							Section:- <span>D2308</span>
						</div>
					</div>
					<div className="searchBox">
						<input
							value={searchBoxText}
							onChange={(e) => setSearchBoxText(e.target.value)}
							onKeyDown={(e) => {
								if (e.keyCode === 13 || e.which === 13) {
									handleSearch();
								}
							}}
							type="text"
							placeholder="Search Registration No."
						/>
						<SearchIcon sx={{ py: 0.5, pr: 1, cursor: 'pointer' }} onClick={handleSearch} />
					</div>
				</div>

				<div className="tableSemesterTitle">Semester 1 | unit 1</div>
				<Table
					tableAllData={tableAllData}
					isGetLoading={isGetLoading}
					supurUser={supurUser ? true : false}
					tableTitle={
						supurUser
							? ['Subject', 'Syllabus', 'PPT', 'Notes', 'Edit/Add']
							: ['Subject', 'Syllabus', 'PPT', 'Notes']
					}
				/>
			</div>

			{/* <FootBar /> */}
			{msg && <ShowMsg isError={msg?.text ? true : false} msgText={msg?.text} type={msg?.type} />}
		</>
	);
}

export default HomePage;
