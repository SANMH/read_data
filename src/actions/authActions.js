import { LOGIN } from '../constants/routes';
import { doLogout } from '../firebase';
import { history } from '../store';
import { LOGIN as LOGIN_ACTION, LOGOUT } from '../constants/actions';
import Firebase from 'firebase';

export const startSetLoginState = (user) => {
	return (dispatch) => {
		let ref = Firebase.database().ref('users/');
		ref.on('value', (snapshot) => {
			const usersObject = snapshot.val();
			let isAdmin = false;
			if (
				usersObject &&
				usersObject[user] &&
				usersObject[user].admin &&
				usersObject[user].admin == true
			) {
				isAdmin = true;
			}

			console.log('uid', user);
			console.log('isAdmin', isAdmin);

			localStorage.setItem('isAdmin', isAdmin);
		});

		if (localStorage.getItem('isAdmin') === 'true') {
			dispatch(loginAction(user));
			localStorage.removeItem('adminErrorText');
		} else if (localStorage.getItem('isAdmin') === 'false') {
			localStorage.setItem(
				'adminErrorText',
				'No es un usuario administrador. ¡No puedes iniciar sesión!',
			);
		}
	};
};

export const loginAction = (user) => {
	return {
		type: LOGIN_ACTION,
		user,
	};
};

export const startLogout = () => {
	return (dispatch) => {
		localStorage.removeItem('isAdmin');
		localStorage.removeItem('adminErrorText');
		doLogout()
			.then(() => {
				dispatch(logoutAction());
				history.push(LOGIN);
				window.location.reload();
			})
			.catch();
	};
};

export const logoutAction = () => ({
	type: LOGOUT,
});
