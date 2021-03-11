import React from 'react';
import styles from './AboutPage.module.css';

const AboutPage = () => {
	return (
		<div className={styles.body}>
			<div className={styles.upperText}>


				<h1 style={{ color: '#28ba62' }}>¿Quiénes somos?</h1>

				<p style={{ color: "#3880ff" }}> 
					Somos una startup en crecimiento, interesada en promover la
					movilidad sostenible en la ciudad, a través del uso de la
					bicicleta como medio de transporte. Para ello, nos hemos
					comprometido en crear nuevas bicirutas pensadas en el número
					de ciclistas que circulan diariamente por las calles de la
					capital. Construyendo así, una ciudad mas segura y amigable
					con los ciclistas y el medio ambiente.
				</p>
				<h1 style={{ color: '#28ba62' }}>¿Qué puedes hacer con CityOnBike?</h1>
				<p style={{ color: "#3880ff" }}>
					➔ Grabar tu ruta de viaje y conocer la distancia que has
					recorrido en tu día a día.
				</p>
				<p style={{ color: "#3880ff" }}>
					➔ Ver tu progreso diario, mensual y anual, mediante gráficas
					y datos que te permitirán conocer tu desempeño en bicicleta.
				</p>
				<p style={{ color: "#3880ff" }}>
					➔ Ver todas las trayectorias que haz recorrido por toda la
					ciudad.
				</p>
				<p style={{ color: "#3880ff" }}>
					➔ Ver cuales son las rutas seguras por las cuales puedes
					movilizarte por la ciudad de forma segura, sin preocuparte
					del tráfico vehicular.
				</p>
			</div>
		</div>
	);
};

export default AboutPage;
