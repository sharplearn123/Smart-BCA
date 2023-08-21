import React from 'react';
import Loader from '../Loader/Loader';

import './table.css';

function Table({ isGetLoading, tableAllData }) {
	return (
		<>
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
		</>
	);
}

export default Table;
