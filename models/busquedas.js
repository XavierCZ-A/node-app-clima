import axios, { Axios } from "axios";
import fs from 'fs';

class Busquedas{

    historial = []
    dbpath = "./db/database.json"

    constructor(){
        this.leerDB()
    }
    get paramsMap() {
        return {
            'access_token': process.env.API_KEY,
            'limit': 5, 
            'lenguage': 'es'
        }
    }

    get paramsWheater(){
        return {
            appid: process.env.WHEATER_KEY,
            units: "metric",
            lang: 'es'
        }
    }
    
    async ciudad(lugar){
        
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMap
            });
            // Hacemos la peticion get 
            const resp = await instance.get()
            //Retornamos la respuesta 
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]

            }));
        } catch (error) {
            return [];
        }
    }

    async climaLugar(lat, lon){
        try {
            //instancia
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,

                params: {...this.paramsWheater, lat , lon}
            });

            const resp = await instance.get()
            const {weather, main} = resp.data
            
            return {
                desc: weather[0].description,
                temp: main.temp,
                max: main.temp_max,
                min: main.temp_min,
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    async guardarHistorial(lugar){
        if (this.historial.includes(lugar)){
            return;
        }
        this.historial.unshift(lugar)
        this.guardarDB()
    }

    guardarDB(){
        const payLoad = {
            historial: this.historial
        } 
        fs.writeFileSync(this.dbpath, JSON.stringify(payLoad));
    }
    
    leerDB(){
        if (!fs.existsSync(this.dbpath)){
            return;
        }

        const info = fs.readFileSync(this.dbpath, {encoding:"utf-8"});

        const data = JSON.parse(info); 

        this.historial = data.historial 


    }

}


export { Busquedas };

