import {
	getFirestore,
	// collection,
	getDoc,
	doc,
} from 'firebase/firestore';

const database = getFirestore();
// collection ref
// const colRef = collection(database, 'user_info');

// const userId = JSON.parse(localStorage.getItem('user_details'))?.userId || '';

//get all table data
async function getSearchedUser(registration_no, setSearchedUserData, handleMsgShown, setIsGetApiLoading) {
	setIsGetApiLoading(true);
	const docRef = doc(database, 'user_info', registration_no);
	await getDoc(docRef)
		.then((docSnap) => {
			setSearchedUserData(docSnap?.data());
			setIsGetApiLoading(false);
		})
		.catch((error) => {
			handleMsgShown(error, 'error');
			console.log(error);
			setIsGetApiLoading(false);
		});
}
export { getSearchedUser };
