require("dotenv").config();

const path = require("path");
const express = require("express");
const hbs = require("hbs");

const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();

//  paths
const publicDirectory = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// templating
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectory));

// Routes

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "I need an address",
    });
  }
  geocode(req.query.address, (error, { lat, lon, location } = {}) => {
    if (error) {
      return res.send({ error });
    }

    forecast(lat, lon, (error, forecastData) => {
      if (error) {
        return res.send({ error });
      }
      res.send({
        forecastData: forecastData,
        location,
        address: req.query.address,
      });
    });
  });
});

// 404
app.get("*", (req, res) => {
  res.render("404", {
    message: "Looks like you're lost, bud",
    img: "https://i.kym-cdn.com/photos/images/original/001/809/295/3d5.jpg",
  });
});

app.listen(3000, () => {
  console.log("Server is up on port 3000");
});
