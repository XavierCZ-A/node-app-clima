import 'dotenv/config'

import { inquirerMenu, leerInput, pause, listadoLugares } from './helpers/inquirer.js';
import colors from 'colors';
import { Busquedas } from './models/busquedas.js';


const questions = async  () => {
    let opt;

    // Creamos la instancia de la clase
    const busqueda = new Busquedas
    const clima = new Busquedas
    const historial = new Busquedas



    //Llamamos a la funcion para ver el menu
    do {
        opt = await inquirerMenu()
        console.log({ opt });

        switch (opt) {
            case 1:
                // Mostrar el mensaje
                const lugar  = await leerInput("Ciudad: ".yellow);
                //Busqueda de los lugares
                const lugares = await busqueda.ciudad(lugar);
                //Seleccion del lugar
                const idSelected = await listadoLugares(lugares);
                if (idSelected == "0") continue;

                //Buscar el id seleccionado para mostrar
                const lugarSelected = lugares.find(a => a.id == idSelected)
                //guardar en el historial
                historial.guardarHistorial(lugarSelected.nombre) 
                
                // console.log(lugarSelected);

                const climaSelected = await clima.climaLugar(lugarSelected.lat, lugarSelected.lng)

                console.log("Informacion de la ciudad ".red);
                console.log("Ciudad: ", lugarSelected.nombre.yellow);
                console.log("Lat: ", lugarSelected.lat);
                console.log("Lng: ", lugarSelected.lng);
                console.log("Temperatura", climaSelected.temp,);
                console.log("Maxima: ", climaSelected.max,);
                console.log("Minima: ", climaSelected.min);
                break;

            case 2:
                historial.historial.forEach((lugar, i) => {
                    const idx = `${i + 1}.`.blue;
                    console.log(`${idx} ${lugar}`);
                });
                break;


        }
        if (opt !== 0) {
            await pause();
        }

    } while (opt !== 0);



}


questions();
