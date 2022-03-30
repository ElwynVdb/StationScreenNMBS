import axios, { Axios } from "axios";

export class RailApi {

    private static INSTANCE: Axios = axios.create({
        baseURL: "https://api.irail.be/",
        timeout: 3000,
        headers: { 'User-Agent': `stationscreen/1.0 (${process.env.WEBSITE};${process.env.EMAIL_ADRESS})` }
    });

    public static async getLiveBoard(stationName: string, language: string, alerts: boolean): Promise<LiveBoard | undefined> {
        let date = new Date(Date.now());;
        let options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" };
        let timeSplit = date.toLocaleDateString("nl-BE", options).split(" ");

        let request = await this.INSTANCE.get("/liveboard", {
            params: {
                "station": stationName,
                "alerts": alerts,
                "lang": language,
                "date": timeSplit[0].replace(/\//g, ""),
                "time": timeSplit[1].replace(/:/g, ""),
                "arrdep": "departure",
                "format": "json"
            }
        });

        if (request.status == 200) {
            let data: LiveBoard = request.data;
            return data;
        }
    }
}

export interface Stationinfo {
    locationX: string;
    locationY: string;
    id: string;
    name: string;
    standardname: string;
}

export interface Vehicleinfo {
    name: string;
    shortname: string;
    number: string;
    type: string;

}

export interface Platforminfo {
    name: string;
    normal: string;
}

export interface Occupancy {
    name: string;
}

export interface Departure {
    id: string;
    delay: string;
    station: string;
    stationinfo: Stationinfo;
    time: string;
    vehicle: string;
    vehicleinfo: Vehicleinfo;
    platform: string;
    platforminfo: Platforminfo;
    canceled: string;
    left: string;
    isExtra: string;
    departureConnection: string;
    occupancy: Occupancy;
}

export interface Departures {
    number: string;
    departure: Departure[];
}

export interface LiveBoard {
    version: string;
    timestamp: string;
    station: string;
    stationinfo: Stationinfo;
    departures: Departures;
}