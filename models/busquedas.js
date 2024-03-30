const axios = require('axios');
const fs = require ('fs');
const { log } = require('util');


class Busquedas {
    historial = [];
    dbPath = './db/database.json';

    constructor(){
        this.leerDB();
    }

    HistorialCapitalizado() {

        return this.historial.map(lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));

            return palabras.join(' ')
        })

        
       
    }
    

    get paramsMapbox () {
        return {
            'access_token':process.env.MAPBOX_KEY,
            'limit': 5,
            'lenguage': 'es'
        }
    }

     paramsMapboxClima (lat, lon) {
        return {
            'appid':process.env.OPENWEATHER_KEY,
            'lat': lat,
            'lon': lon,
            'lang': 'es',
            'units': 'metric'
        }
    }


    async ciudad( lugar = '' ){

        try {

            const intance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });

            const resp = await intance.get();

            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]

            }) );


            
        } catch (error) {
            return [];

        }

    }


    async climaLugar(lat, lon){
        
        try {

            //instance axios
            const intance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: this.paramsMapboxClima(lat,lon)
            });

            const resp = await intance.get();


            // resp.data

            return {
                desc: resp.data.weather[0].description,
                min: resp.data.main.temp_min,
                max: resp.data.main.temp_max,
                temp: resp.data.main.temp,
            }


            
        } catch (error) {
            console.log(error);
            
        }
    }

    

    agregarHistorial(lugar) {

        if (this.historial.includes(lugar.toLowerCase())) {
            return;
        }

        this.historial.unshift(lugar.toLowerCase() );
        
        this.guardarDB();
    }

    guardarDB() {

        const payload = {
            historial: this.historial
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload))

    }

    leerDB() {
        //debe existir db...
        if (!fs.existsSync(this.dbPath)){
            return null;
        }
        //const info... readfylesinc .... path.... encoding utf-8

        const info = fs.readFileSync( this.dbPath, { encoding: 'utf-8'});
        const data = JSON.parse(info);

        this.historial = data.historial;   // tiene que ser data.historial porque el json parse extrae como objeto y para hacer un foreach en el index se necesita que sea un array
        

        }






    }








module.exports = Busquedas;