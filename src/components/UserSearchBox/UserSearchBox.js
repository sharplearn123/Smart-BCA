import React, { useCallback, useState } from 'react';

import SearchIcon from '@mui/icons-material/Search';

import './userSearchBox.css';

function UserSearchBox({ sx, newClass }) {
	const [searchBoxText, setSearchBoxText] = useState('');

	const handleSearch = useCallback(() => {
		if (searchBoxText.trim() === '') return;
		window.open(window.location?.origin + '/user/' + searchBoxText, '_self', false);
	}, [searchBoxText]);

	return (
		<div className={'searchBox ' + newClass} style={sx}>
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
	);
}

export default UserSearchBox;
