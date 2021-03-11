import React from 'react';

const Loading = ( { isLoading, error } ) => {
  // Manejar el estado de carga
  if( isLoading ) {
    return <div>Cargando...</div>;
  }
  // Manejar el estado de error
  else if( error ) {
    return <div>
    Lo sentimos, hubo un problema al cargar la página.</div>;
  } else {
    return null;
  }
};

export default Loading;