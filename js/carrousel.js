
export function carousel(id) {
    const fila = document.getElementById(`carouselImg-${id}`);
    const padre = document.getElementById(`padre-${id}`);
    const misPeliculas = document.getElementById(`pelis-${id}`);
    const peliculas = misPeliculas.querySelectorAll(`.pelicula`);

    const flechaIzquierda = document.getElementById(`flecha-izquierda-${id}`);
    const flechaDerecha = document.getElementById(`flecha-derecha-${id}`);

    // ? ----- ----- Event Listener para la flecha derecha. ----- -----
    flechaDerecha.addEventListener('click', () => {
        fila.scrollLeft += fila.offsetWidth;

        /*  const indicadorActivo = padre.querySelector('.indicadores .activo');
          if (indicadorActivo.nextSibling) {
              indicadorActivo.nextSibling.classList.add('activo');
              indicadorActivo.classList.remove('activo');
          }*/
    });

    // ? ----- ----- Event Listener para la flecha izquierda. ----- -----
    flechaIzquierda.addEventListener('click', () => {
        fila.scrollLeft -= fila.offsetWidth;
        /*
            const indicadorActivo = document.querySelector('.indicadores .activo');
            if (indicadorActivo.previousSibling) {
                indicadorActivo.previousSibling.classList.add('activo');
                indicadorActivo.classList.remove('activo');
            }*/
    });

    // ? ----- ----- Paginacion ----- -----
    /*const numeroPaginas = Math.ceil(peliculas.length / 5);
    for (let i = 0; i < numeroPaginas; i++) {
        const indicador = document.createElement('button');
    
        if (i === 0) {
            indicador.classList.add('activo');
        }
    
        document.querySelector('.indicadores').appendChild(indicador);
        indicador.addEventListener('click', (e) => {
            fila.scrollLeft = i * fila.offsetWidth;
    
            document.querySelector('.indicadores .activo').classList.remove('activo');
            e.target.classList.add('activo');
        });
    }*/

    // ? ----- ----- Hover ----- -----
    for (const pelicula of peliculas) {
        pelicula.addEventListener('mouseenter', (e) => {
            const elemento = e.currentTarget;
            setTimeout(() => {
                peliculas.forEach(pelicula => pelicula.classList.remove('hover'));
                elemento.classList.add('hover');
            }, 300);
        });
    }


    fila.addEventListener('mouseleave', () => {
        for (const pelicula of peliculas) {
            pelicula.classList.remove('hover');
        }
    });
}