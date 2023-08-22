import {
	getFirestore,
	collection,
	getDoc,
	doc,
} from 'firebase/firestore';

const database = getFirestore();
// collection ref
// const colRef = collection(database, 'user_info');

// const userId = JSON.parse(localStorage.getItem('user_details'))?.userId || '';

//get all table data
async function getSearchedUser(registration_no, setSearchedUserData, handleMsgShown) {
	const docRef = doc(database, 'user_info', registration_no);
	const docSnap = await getDoc(docRef);
	setSearchedUserData(docSnap?.data());
}

export { getSearchedUser };
