var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

var runGeoQuery = (req, res) => {
  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);

  //A geoJSON point
  var point = {
    type: "Point",
    coordinates: [lng, lat]
  };

  var geoOptions = {
    spherical: true,
    maxDistance: 2000,
    num: 5
  };

  Hotel
    .geoNear(point, geoOptions, (err, results, stats) => {
      console.log('Geo results', results);
      console.log('Geo stats', stats);
      res
        .status(200)
        .json(results);
    });
};

module.exports.hotelsGetAll = (req, res) => {
  console.log('Requested by: ' + req.user);
  console.log('GET the hotels');
  console.log(req.query);
  var offset = 0;
  var count = 5;
  var maxCount = 10;

  if(req.query && req.query.lat && req.query.lng) {
    runGeoQuery(req, res);
    return;
  }

  if(req.query && req.query.offset) {
    offset = parseInt(req.query.offset, 10);
  }

  if(req.query && req.query.count) {
    count = parseInt(req.query.count, 10);
  }

  if(isNaN(offset) || isNaN(count)) {
    res
      .status(400)
      .json({
        "message": "If supplied in querystring count and offset should be numbers"
      });
    return;
  }

  if(count > maxCount) {
    res
      .status(500)
      .json({
        "message": "Count limit of " + maxCount + " exceeded"
      });
    return;
  } 

  Hotel
    .find()
    .skip(offset)
    .limit(count)
    .exec((err, hotels) => {
      if(err) {
        console.log('Error finding hotels');
        res
          .status(500)
          .json(err);
      } else {
        console.log('Found hotels', hotels.length);
        res
          .json(hotels);
      }
    });
};

module.exports.hotelsGetOne = (req, res) => {
  var hotelId = req.params.hotelId;
  console.log('GET hotelId', hotelId);

  Hotel
    .findById(hotelId)
    .exec((err, doc) => {
      var response = {
        status: 200,
        message: doc
      };
      if(err) {
        console.log('Error finding hotel');
        response.status = 500;
        response.message = err;
      } else if (!doc) {
        response.status = 404;
        response.message = {
          "message": "Hotel ID not found"
        };
      }
      res
        .status(response.status)
        .json(response.message);
    });
};

var _splitArray = input => {
  var output;

  if(input && input.length > 0) {
    output = input.split(';');
  } else {
    output = [];
  }

  return output;
};

module.exports.hotelsAddOne = (req, res) => {
  Hotel
    .create({
      name: req.body.name,
      description: req.body.description,
      stars: parseInt(req.body.stars, 10),
      services: _splitArray(req.body.services),
      photos: _splitArray(req.body.photos),
      currency: req.body.currency,
      location: {
        address: req.body.address,
        coordinates: [
          parseFloat(req.body.lng),
          parseFloat(req.body.lat)
        ]
      }
    }, (err, hotel) => {
      if(err) {
        console.log('Error creating hotel');
        res
          .status(400)
          .json(err);
      } else {
        console.log('Hotel created', hotel);
        res
          .status(201)
          .json(hotel);
      }
    });
};

module.exports.hotelsUpdateOne = (req, res) => {
  var hotelId = req.params.hotelId;
  console.log('GET hotelId', hotelId);

  Hotel
    .findById(hotelId)
    .select("-reviews -rooms")
    .exec((err, doc) => {
      var response = {
        status: 200,
        message: doc
      };
      if(err) {
        console.log('Error finding hotel');
        response.status = 500;
        response.message = err;
      } else if (!doc) {
        response.status = 404;
        response.message = {
          "message": "Hotel ID not found"
        };
      }
      if(response.status !== 200) {
        res
          .status(response.status)
          .json(response.message);
      } else {
        doc.name = req.body.name;
        doc.description = req.body.description;
        doc.stars = parseInt(req.body.stars, 10);
        doc.services = _splitArray(req.body.services);
        doc.photos = _splitArray(req.body.photos);
        doc.currency = req.body.currency;
        doc.location = {
          address: req.body.address,
          coordinates: [
            parseFloat(req.body.lng),
            parseFloat(req.body.lat)
          ]
        };

        doc.save((err, updatedHoted) => {
          if(err) {
            res
              .status(500)
              .json(err);
          } else {
            res
              .status(204)
              .json();
          }
        });
      }
    });
};

module.exports.hotelsDeleteOne = (req, res) => {
  var hotelId = req.params.hotelId;

  Hotel
    .findByIdAndRemove(hotelId)
    .exec((err, hotel) => {
      if(err) {
        res
          .status(404)
          .json(err);
      } else {
        console.log('Hotel deleted, id: ' + hotelId);
        res
          .status(204)
          .json();
      }
    });
};