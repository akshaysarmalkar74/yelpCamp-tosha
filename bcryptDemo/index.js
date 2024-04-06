/** @format */

const bcrypt = require('bcrypt');
// const hashPassword = async (pw) => {
// 	const salt = await bcrypt.genSalt(10);
// 	const hash = await bcrypt.hash(pw, salt);

// 	console.log(salt);
// 	console.log(hash);
// };

const hashPassword = async (pw) => {
	const hash = await bcrypt.hash(pw, 12);
	console.log(hash);
};

const login = async (pw, hashedPw) => {
	const result = await bcrypt.compare(pw, hashedPw);
	if (result) {
		console.log('logged in, success');
	} else {
		console.log('not a match, try again');
	}
};

// hashPassword('monkey');

login('monkEy', '$2b$12$mEDLthP842D2q1O5Yh7hAusJFLdmk450Fpo8xsDprVzed31VFpRxO');
