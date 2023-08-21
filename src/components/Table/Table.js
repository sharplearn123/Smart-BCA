import React, { useState, useCallback } from 'react';

import Loader from '../Loader/Loader';
import ModalWrapper from '../Modal/ModalWrapper';
import ShowMsg from '../ShowMsg/ShowMsg.js';

import { getUserAllNoteData, addNewTableRow, updateTableDetails, deleteData } from '../../firebase//home.js';


import IconButton from '@mui/material/IconButton';
import EditNoteIcon from '@mui/icons-material/EditNote';
import AddCircleOutlineTwoToneIcon from '@mui/icons-material/AddCircleOutlineTwoTone';

import './table.css';

function Table({ isGetLoading, tableAllData, tableTitle, supurUser }) {
	const [msg, setMsg] = useState({ text: '', type: '' });
	const [isModalOpen, setIsModalOpen] = useState({ isOpen: false, modalType: '' });
	const [openModalData, setOpenModalData] = useState({});
	const [isSaveBtnLoading, setIsSaveBtnLoading] = useState(false);

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

	const handleModalToggle = useCallback((modalType) => {
		setIsModalOpen((state) => {
			setOpenModalData({});
			return { ...state, isOpen: !state.isOpen, modalType: modalType };
		});
	}, []);

	const handleEditBtnClick = useCallback(
		(index) => {
			handleModalToggle('edit');
			setOpenModalData(tableAllData?.[index]);
		},
		[handleModalToggle, tableAllData]
	);


	const handleModalInputChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setOpenModalData({ ...openModalData, [name]: value });
		},
		[openModalData]
	);

	//Handle Save Btn Click
	const handleTableDetailsUpdate = useCallback(() => {
		updateTableDetails(openModalData, setIsSaveBtnLoading, handleMsgShown);
	}, [openModalData, handleMsgShown]);

	const handleAddRowBtnClick = useCallback(() => {
		addNewTableRow(openModalData, handleModalToggle, setIsSaveBtnLoading, handleMsgShown);
	}, [handleModalToggle, handleMsgShown, openModalData]);

	return (
		<>
			<div className="subjectTable">
				<div className="tableRow  titleRow">
					{tableTitle?.map((item, index) => (
						<div
							className="column"
							key={index}
							style={
								tableTitle.length - 1 === index && supurUser
									? { cursor: 'pointer', background: '', width: `${100 / tableTitle.length}%` }
									: { width: `${100 / tableTitle.length}%` }
							}
							onClick={
								tableTitle.length - 1 === index && supurUser ? () => handleModalToggle('add') : null
							}
						>
							{item}
							{tableTitle.length - 1 === index && supurUser && (
								<AddCircleOutlineTwoToneIcon sx={{ ml: 1 }} size="small" />
							)}
						</div>
					))}
				</div>

				<Loader isLoading={isGetLoading} />

				{tableAllData.map((item, index) => (
					<div className="tableRow" key={index}>
						<div className="column" style={{ width: `${100 / tableTitle.length}%` }}>
							{item?.subject}
						</div>
						<div className="column" style={{ width: `${100 / tableTitle.length}%` }}>
							{item?.ppt}
						</div>
						<div className="column" style={{ width: `${100 / tableTitle.length}%` }}>
							{item?.books}
						</div>
						<div className="column" style={{ width: `${100 / tableTitle.length}%` }}>
							{item?.syllabus}{' '}
						</div>
						{supurUser && (
							<div className="column" style={{ width: `${100 / tableTitle.length}%` }}>
								<IconButton
									size="small"
									sx={{ py: 0, px: 5 }}
									onClick={() => handleEditBtnClick(index)}
									aria-label="add an alarm"
								>
									<EditNoteIcon size="small" />
								</IconButton>
							</div>
						)}
					</div>
				))}
			</div>
			<ModalWrapper
				open={isModalOpen?.isOpen}
				handleModalToggle={handleModalToggle}
				modalType={isModalOpen?.modalType}
				openModalData={openModalData}
				handleModalInputChange={handleModalInputChange}
				handleTableDetailsUpdate={handleTableDetailsUpdate}
				isSaveBtnLoading={isSaveBtnLoading}
				handleAddRowBtnClick={handleAddRowBtnClick}
			/>
			{msg && <ShowMsg isError={msg?.text ? true : false} msgText={msg?.text} type={msg?.type} />}

		</>
	);
}

export default Table;
