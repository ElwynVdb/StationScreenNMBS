import express, { Request, Response } from "express";

import { RailApi } from "./RailApi";
import { DateTime } from "luxon";

const router = express.Router();
const default_station_name = "Antwerpen";

declare module 'express-session' {
    interface SessionData {
      station: string;
    }
  }

router.get("/", async (req: Request, res: Response) => {
    let station = req.session.station != undefined ? req.session.station : default_station_name;

    const date = DateTime.now().toJSDate();

    let data;
    try {
    data = (await RailApi.getLiveBoard(station, "nl", false))?.departures.departure.filter(d => parseInt(d.id) <= 30);
    station = station[0].toUpperCase() + station.slice(1).toLowerCase();
    }
    catch (e) {  
        station = `${station} niet gevonden, toont nu ${default_station_name}`;
        data = (await RailApi.getLiveBoard(default_station_name, "nl", false))?.departures.departure.filter(d => parseInt(d.id) <= 30);
    }

    res.status(200).render("index", { station, date, departures: data});
});

router.post("/", async (req: Request, res: Response) => {
    if (req.body.station && req.body.station.trim() != "") 
        req.session.station = req.body.station;

    res.redirect("/");
});

module.exports = router; 