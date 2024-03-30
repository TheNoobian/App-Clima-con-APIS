const { leerInput, inquirerMenu, pausa, listadoLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");
require('dotenv').config()



const main = async() => {

    let opt;
    const busquedas = new Busquedas();


    do {

        opt = await inquirerMenu()

        switch (opt) {
            case 1:
                // mostrar mensaje
                const termino = await leerInput('Ciudad: ');
                

                //Buscar lugares

                const lugares = await busquedas.ciudad( termino );

                // seleccionar lugar
                const id = await listadoLugares(lugares);
                const lugarSel = lugares.find( lugar => lugar.id === id )

                // sacar datos del clima

                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng)

                // const clima = await busquedas.climaLugar()

                // mostrar resultados
                console.clear();
                console.log('\nINFORMACION DE LA CIUDAD\n'.cyan);
                console.log('Ciudad: ',lugarSel.nombre.green);
                console.log('Lat: ',lugarSel.lat);
                console.log('Lng: ',lugarSel.lng);
                console.log('Temperatura: ',clima.temp);
                console.log('Minima: ',clima.min);
                console.log('Maxima: ',clima.max);
                console.log('Como esta el clima: ',clima.desc.green);

                
            break;

            case 2:
                console.log("eligio la opcion 2");

            break;

        }

        await pausa();
        
    } while (opt !== 0);


}

main();