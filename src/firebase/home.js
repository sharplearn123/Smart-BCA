import { storage } from './initFirebase';

// import { encryptText, decryptText } from '../utils';

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

import { ref, uploadBytesResumable, deleteObject, getDownloadURL } from 'firebase/storage';

const database = getFirestore();
// collection ref
const colRef = collection(database, 'subject_table');

const photoNotAvailable =
	'https://firebasestorage.googleapis.com/v0/b/sharplearn-2fe87.appspot.com/o/photoNotAvailable.jpeg?alt=media&token=18505eb6-80ee-4e9a-b81b-8a1a84c6e23d';

// const userId = JSON.parse(localStorage.getItem('user_details'))?.userId || '';

function getAllTableData(setAllCourses, setIsGetLoading, handleMsgShown) {
	const getDataQuery = query(colRef, orderBy('subject', 'desc')); // orderBy('name', 'desc || ase')
	setIsGetLoading(true);
	onSnapshot(
		colRef,
		async (realSnapshot) => {
			await getDocs(getDataQuery)
				.then((snapshot) => {
					let tableData = [];
					snapshot.docs.forEach((doc) => {
						tableData.push({
							courseId: doc.id,
							subject: doc.data()?.subject,
							ppt: doc.data()?.ppt,
							syllabus: doc.data()?.syllabus,
							books: doc.data()?.books,

							updatedOn: doc.data()?.updatedOn,
						});
					});
					setIsGetLoading(false);
					setAllCourses(tableData);
					console.log(tableData);
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

// //Add Notes
function addNewCourse(incomingData, imageFileRef, setIsNotesModalOpen, setIsAddBtnLoading, handleMsgShown) {
	const { courseName, aboutCourse, courseType, courseORGPrice, courseDiscountedPrice, demoVideo, courseLink } =
		incomingData;
	if (
		!courseName ||
		!aboutCourse ||
		!courseType ||
		!courseORGPrice ||
		!courseDiscountedPrice ||
		!demoVideo ||
		!courseLink
	) {
		handleMsgShown('Please Provide all details', 'error');
		console.log('Please Provide all details');
		return;
	}
	setIsAddBtnLoading(true);
	if (imageFileRef) {
		addDoc(colRef, { ...incomingData, updatedOn: serverTimestamp(), createdOn: serverTimestamp() })
			.then((e) => {
				const newCourseId = e?.id;
				const desertRef = ref(storage, courseType + '/' + newCourseId + '_' + courseType + '_thumbnail');

				uploadBytesResumable(desertRef, imageFileRef)
					.then((snapshot) => {
						getDownloadURL(snapshot.ref)
							.then((downloadURL) => {
								const docRef = doc(database, 'All_Courses', newCourseId);
								updateDoc(docRef, { courseThumbnail: downloadURL, courseId: newCourseId })
									.then(() => {
										console.log('Course added Successfully');
										setIsNotesModalOpen(false);
										setIsAddBtnLoading(false);
										handleMsgShown('Course Added Successfully', 'success');
									})
									.catch((err) => {
										handleMsgShown(err.code, 'error');
										setIsAddBtnLoading(false);
										console.log(err.message);
									});
							})
							.catch((err) => {
								setIsAddBtnLoading(false);
								console.log(err.message);
								handleMsgShown(err.code, 'error');
							});
					})
					.catch((err) => {
						setIsAddBtnLoading(false);
						console.log(err.message);
						handleMsgShown(err.code);
					});
			})
			.catch((err) => {
				setIsAddBtnLoading(false);
				handleMsgShown(err.code);
				console.log(err);
			});
	} else {
		addDoc(colRef, { ...incomingData, updatedOn: serverTimestamp(), createdOn: serverTimestamp() })
			.then((e) => {
				const newCourseId = e?.id;

				const docRef = doc(database, 'All_Courses', newCourseId);
				updateDoc(docRef, { courseId: newCourseId, courseThumbnail: photoNotAvailable })
					.then(() => {
						console.log('Course added Successfully');
						setIsNotesModalOpen(false);
						setIsAddBtnLoading(false);
						handleMsgShown('Course Added Successfully', 'success');
					})
					.catch((err) => {
						handleMsgShown(err.code, 'error');
						setIsAddBtnLoading(false);
						console.log(err.message);
					});
			})
			.catch((err) => {
				setIsAddBtnLoading(false);
				handleMsgShown(err.code);
				console.log(err);
			});
	}
}

//delete course
function deleteData(courseId, courseType, setIsNotesModalOpen, setMsg, handleMsgShown) {
	if (!courseId || !courseType) {
		handleMsgShown('Please Provide all details', 'error');
		console.log('Please Provide all details');
		return;
	}
	const docRef = doc(database, 'All_Courses', courseId);

	deleteDoc(docRef)
		.then((e) => {
			const desertRef = ref(storage, courseType + '/' + courseId + '_' + courseType + '_thumbnail');
			setIsNotesModalOpen(false);
			deleteObject(desertRef)
				.then(() => {
					console.log('File deleted successfully');
				})
				.catch((err) => {
					console.log(err.message);
					setMsg(err.code);
				});
		})
		.catch((err) => {
			console.log(err.message);
			setMsg(err.code);
		});
}

//update course
function updateCourseDetails(incomingData, imageFileRef, setIsSaveLoading, handleMsgShown) {
	const {
		courseId,
		courseName,
		courseType,
		aboutCourse,
		courseORGPrice,
		courseDiscountedPrice,
		demoVideo,
		courseLink,
	} = incomingData;
	if (
		!courseId ||
		!courseName ||
		!courseType ||
		!aboutCourse ||
		!courseORGPrice ||
		!courseDiscountedPrice ||
		!demoVideo ||
		!courseLink
	) {
		handleMsgShown('Please Provide all details', 'error');
		console.log('Please Provide all details');
		return;
	}
	setIsSaveLoading(true);
	const docRef = doc(database, 'All_Courses', courseId);

	if (imageFileRef) {
		const desertRef = ref(storage, courseType + '/' + courseId + '_' + courseType + '_thumbnail');

		uploadBytesResumable(desertRef, imageFileRef)
			.then((snapshot) => {
				console.log('Uploaded successfully a blob or file!');

				getDownloadURL(snapshot.ref)
					.then((downloadURL) => {
						updateDoc(docRef, {
							...incomingData,
							courseThumbnail: downloadURL,
							updatedOn: serverTimestamp(),
						})
							.then(() => {
								setIsSaveLoading(false);
								handleMsgShown('Course Updated Successfully', 'success');
							})
							.catch((err) => {
								setIsSaveLoading(false);
								console.log(err.message);
								handleMsgShown(err.code, 'error');
							});
					})
					.catch((err) => {
						setIsSaveLoading(false);
						console.log(err.message);
						handleMsgShown(err.code, 'error');
					});
			})
			.catch((err) => {
				setIsSaveLoading(false);
				console.log(err.message);
				handleMsgShown(err.code);
			});
	} else {
		let courseThumbnail = incomingData?.courseThumbnail
			? incomingData?.courseThumbnail
			: 'https://firebasestorage.googleapis.com/v0/b/sharplearn-2fe87.appspot.com/o/photoNotAvailable.jpeg?alt=media&token=18505eb6-80ee-4e9a-b81b-8a1a84c6e23d';
		updateDoc(docRef, { ...incomingData, courseThumbnail, updatedOn: serverTimestamp() })
			.then(() => {
				setIsSaveLoading(false);
				handleMsgShown('Course Updated Successfully', 'success');
			})
			.catch((err) => {
				handleMsgShown(err.code, 'error');
				setIsSaveLoading(false);
				console.log(err.message);
			});
	}
}

export { getAllTableData, addNewCourse, updateCourseDetails, deleteData };
