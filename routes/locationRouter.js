const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const locationRouter = express.Router();
locationRouter.use(bodyParser.json());

// SEARCH LOCATION BY KEY
locationRouter.route("/search/:key").get(async (req, res) => {
  const key = req.params.key;
  let locations = [];
  let { data } = await axios.get(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${key}&types=geocode&key=AIzaSyC5HxR2IAiiLhXIuCQxctsKq7AVp1CaGmI`
  );

  if (data && data.predictions.length > 0) {
    for (i = 0; i < data.predictions.length; i++) {
      let obj = {};
      let location = data.predictions[i].description;
      location = location?.split(",");
      obj["city_name"] = location[0] || "";
      obj["state_name"] = location[location.length-2] || "";
      obj["country_name"] = location[location.length-1] || "";
      locations.push(obj);
    }
  }
  data && res.json({ locations });
});

module.exports = locationRouter;
