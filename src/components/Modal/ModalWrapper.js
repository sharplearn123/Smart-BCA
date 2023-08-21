import React from 'react';
import Modal from '@mui/material/Modal';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

import photoNotAvailable from '../../images/photoNotAvailable.jpeg';

import './modalWrapper.css';

function ModalWrapper({
	open,
	modalType,
	handleModalToggle,
	containerClassName,
	openModalData,
	handleModalInputChange,
	handleTableDetailsUpdate,
	isSaveBtnLoading,
	toggleConfirmationDialogClosing,
	handleAddRowBtnClick,
	isAddBtnLoading,
}) {
	return (
		<Modal open={open} onClose={() => handleModalToggle('')}>
			<div className={['modal', containerClassName].join('')}>
				<div className="modalHeader">
					<div>{new Date(openModalData?.updatedOn?.seconds * 1000)?.toLocaleString('en-US')}</div>
					<Button id="closeBtn" color="inherit" variant="text" onClick={handleModalToggle}>
						Close
					</Button>
				</div>

				<div className="modalCourseBox">
					<TextField
						label="Subject"
						name="subject"
						className="muiInputBox"
						required={true}
						autoComplete="off"
						value={openModalData?.subject || ''}
						onChange={handleModalInputChange}
					/>
					<TextField
						label="PPT"
						name="ppt"
						className="muiInputBox"
						required
						autoComplete="off"
						value={openModalData?.ppt || ''}
						onChange={handleModalInputChange}
					/>
					<TextField
						label="Books"
						name="books"
						className="muiInputBox"
						required
						autoComplete="off"
						value={openModalData?.books || ''}
						onChange={handleModalInputChange}
					/>
					<TextField
						label="Syllabus"
						name="syllabus"
						className="muiInputBox"
						required
						autoComplete="off"
						value={openModalData?.syllabus || ''}
						onChange={handleModalInputChange}
					/>
					<br />
					{modalType === 'edit' ? (
						<div className="editModalButtons">
							<Button
								variant="contained"
								color="error"
								id="basic-button"
								aria-haspopup="true"
								// onClick={onBtnClick}
								// disabled={isBtnLoading}
								sx={{
									fontWeight: 600,
									p: 0,
									height: 40,
									width: 140,
									mr: 2,
								}}
							>
								Delete
							</Button>
							<Button
								variant="contained"
								onClick={handleTableDetailsUpdate}
								color="success"
								sx={{
									fontWeight: 600,
									p: 0,
									height: 40,
									width: 140,
								}}
							>
								{isSaveBtnLoading ? <CircularProgress size={30} /> : 'Save'}
							</Button>
						</div>
					) : (
						<Button
							variant="contained"
							onClick={handleAddRowBtnClick}
							color="success"
						>
							Add
						</Button>
					)}
				</div>
			</div>
		</Modal >
	);
}

export default ModalWrapper;
