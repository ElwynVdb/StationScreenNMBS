import axios, { Axios } from "axios";
import { DateTime } from "luxon";

export class RailApi {

    private static INSTANCE: Axios = axios.create({
        baseURL: "https://api.irail.be/",
        timeout: 3000,
        headers: { 'User-Agent': `stationscreen/1.0 (${process.env.WEBSITE};${process.env.EMAIL_ADRESS})` }
    });

    public static async getLiveBoard(stationName: string, language: string, alerts: boolean): Promise<LiveBoard | undefined> {
        const request = await this.INSTANCE.get<LiveBoard>("/liveboard", {
            params: {
                "station": stationName,
                "alerts": alerts,
                "lang": language,
                "arrdep": "departure",
                "format": "json"
            }
        });


        if (request.status === 200) {
            return request.data;
        }
    }

    public static async getStations(language: string): Promise<Stations | undefined> {
        let request = await this.INSTANCE.get("/stations",
            {
                params: {
                    "lang": language,
                    "format": "json"
                }
            });
        if (request.status != 200) console.log("error");
        if (request.status == 200) return request.data;
    }
}


export interface Stations {
    name: string;
    standardname: string;
    id: string;
}

interface LiveBoard {
    readonly version: string;
    readonly timestamp: string;
    readonly station: string;
    readonly stationinfo: StationInfo
    readonly departures: {
        readonly number: string;
        readonly departure: Array<Departure>
    }
}

interface StationInfo {
    readonly locationX: string;
    readonly locationY: string;
    readonly id: string;
    readonly name: string;
    readonly standardname: string;
    readonly '@id': string;
}

interface VehicleInfo {
    readonly name: string;
    readonly shortname: string;
    readonly number: string;
    readonly type: string;
    readonly locationX: string;
    readonly locationY: string;
    readonly '@id': string;
}

interface PlatformInfo {
    readonly name: string;
    readonly normal: string;
}

interface Departure {
    readonly id: string;
    readonly delay: string;
    readonly station: string;
    readonly stationinfo: StationInfo;
    readonly time: string;
    readonly vehicle: string;
    readonly vehicleinfo: VehicleInfo;
    readonly platform: string;
    readonly platforminfo: PlatformInfo;
    readonly canceled: string;
    readonly left: string;
    readonly isExtra: boolean;
    readonly departureConnection: string;
}