import {
	getFirestore,
	collection,
	onSnapshot,
	getDocs,
	addDoc,
	deleteDoc,
	updateDoc,
	doc,
	query,
	serverTimestamp,
	orderBy,
} from 'firebase/firestore';

const database = getFirestore();
// collection ref
const colRef = collection(database, 'subject_table');

// const userId = JSON.parse(localStorage.getItem('user_details'))?.userId || '';

//get all table data-----Read
function getAllTableData(setAllCourses, setIsGetLoading, handleMsgShown) {
	const getDataQuery = query(colRef, orderBy('subject')); // orderBy('name', 'desc || ase')
	setIsGetLoading(true);
	onSnapshot(
		colRef,
		async (realSnapshot) => {
			await getDocs(getDataQuery)
				.then((snapshot) => {
					let tableData = [];
					snapshot.docs.forEach((doc) => {
						tableData.push({
							rowId: doc.id,
							subject: doc.data()?.subject,
							ppt: doc.data()?.ppt,
							syllabus: doc.data()?.syllabus,
							notes: doc.data()?.notes,
							books: doc.data()?.books,

							updatedOn: doc.data()?.updatedOn,
						});
					});
					setIsGetLoading(false);
					setAllCourses(tableData);
				})
				.catch((err) => {
					setIsGetLoading(false);
					console.log(err.message);
					handleMsgShown(err.code, 'error');
				});
		},
		(err) => {
			setIsGetLoading(false);
			console.log(err);
			handleMsgShown(err.code, 'error');
		}
	);
}

//Add row to Database-----Create
function addNewTableRow(incomingData, handleModalToggle, setIsAddBtnLoading, handleMsgShown) {
	const { subject, syllabus, ppt, notes, books } = incomingData;

	if (!subject?.trim() || !syllabus?.trim() || !ppt?.trim() || !notes?.trim() || !books?.trim) {
		handleMsgShown('Please Provide all details', 'error');
		console.log('Please Provide all details');
		return;
	}
	setIsAddBtnLoading(true);

	addDoc(colRef, { ...incomingData, updatedOn: serverTimestamp(), createdOn: serverTimestamp() })
		.then((e) => {
			console.log('Course added Successfully');
			setIsAddBtnLoading(false);
			handleModalToggle('');
			handleMsgShown('Course Added Successfully', 'success');
		})
		.catch((err) => {
			setIsAddBtnLoading(false);
			handleMsgShown(err.code);
			console.log(err.code);
		});
}

//delete table row-----Delete
function deleteTableRow(rowId, handleModalToggle, handleMsgShown) {
	if (!rowId) {
		handleMsgShown('Please Provide all details', 'error');
		console.log('Please Provide all details');
		return;
	}
	const docRef = doc(database, 'subject_table', rowId);

	deleteDoc(docRef)
		.then((e) => {
			handleModalToggle('');
			handleMsgShown('Deleted Successfully', 'success');
		})
		.catch((err) => {
			console.log(err.message);
			handleMsgShown(err.code, 'error');
		});
}

//update Table Details-----Update
function updateTableDetails(incomingData, setIsSaveLoading, handleMsgShown) {
	const { rowId, syllabus, subject, ppt, notes, books } = incomingData;

	if (!rowId?.trim()) {
		handleMsgShown('Missing rowId', 'error');
		console.log('Missing rowId');
		return;
	} else if (!subject?.trim() || !syllabus?.trim() || !ppt?.trim() || !notes?.trim() || !books?.trim) {
		handleMsgShown('Please Provide all details', 'error');
		console.log('Please Provide all details');
		return;
	}

	setIsSaveLoading(true);
	const docRef = doc(database, 'subject_table', rowId);

	updateDoc(docRef, { ...incomingData, updatedOn: serverTimestamp() })
		.then(() => {
			setIsSaveLoading(false);
			handleMsgShown('Course Updated Successfully', 'success');
			console.log('Course Updated Successfully');
		})
		.catch((err) => {
			handleMsgShown(err.code, 'error');
			setIsSaveLoading(false);
			console.log(err.message);
		});
}

export { getAllTableData, addNewTableRow, updateTableDetails, deleteTableRow };
