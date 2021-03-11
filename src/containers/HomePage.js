import React from 'react';
import styles from './HomePage.module.css';

const HomePage = () => {
	return (
		<div className={styles.body}>
			<div className={styles.upper}>
				<div className={styles.upperText}>
					<h1 style={{ color: '#28ba62' }}>CityOnBike web</h1>
					<p style={{ color: "#3880ff" }}>
						Maneja de manera sencilla toda la información recogida a
						través de nuestra aplicación móvil (CityOnBike app) y la
						presente en diferentes módulos donde podremos usarla
						para la creación de rutas rápidas y seguras para los
						ciclistas.
					</p>
					<p style={{ color: "#3880ff" }}>
						El Sistema Web CItyOnBike te ofrece los siguientes
						beneficios:
					</p>
					<p style={{ color: "#3880ff" }}>
						➔ Creación , visualización y administración de
						Bicirutas.
					</p>
					<p style={{ color: "#3880ff" }}>
						➔ Administración de las rutas creadas por los usuarios
						de app móvil.
					</p>
					<p style={{ color: "#3880ff" }}>➔ Gestión de usuarios.</p>
					<p style={{ color: "#3880ff" }}>➔ Acceso exclusivo solo a usuarios administradores.</p>
				</div>
				<div className={styles.epnImageContainer}>
					<img
						className={styles.epnImage}
						src="images/epn.png"
						alt="City On Bike"
					/>
				</div>
			</div>
			<div className={styles.lower}>
				<h2 className={styles.whiteText}>Elaborado en:</h2>
				<div className={styles.images}>
					<img
						className={styles.image}
						src="images/firebase.png"
						alt="Firebase"
					/>
					<img
						className={styles.image + ' ' + styles.middleImage}
						src="images/gmaps.png"
						alt="React"
					/>
					<img
						className={styles.image}
						src="images/react.png"
						alt="Google Maps"
					/>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
