const axios = require('axios');


class Busquedas {
    historial = '';

    constructor(){
        //leer db si existe
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





}


module.exports = Busquedas;