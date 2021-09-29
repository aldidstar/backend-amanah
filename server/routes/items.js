var express = require("express");
var router = express.Router();
const path = require("path");
const { query } = require("express");

module.exports = function (db) {
  router.get("/", function (req, res) {
    
    let sql = `select * from items order by name `;
    db.query(sql, (err, result) => {
      if (err) {
  
        res.status(201).json({
          success: false,
          message: "something wrong",
          err,
        });
      }
     
        res.status(200).json(result.rows);
        
      });
    });


  router.post("/", (req, res) => {
    if(req.files.photos.size <= 102400 && (req.files.photos.mimetype === "image/jpeg" || req.files.photos.mimetype === "image/png")){
      var baseUrl = `http://${req.headers.host}`;
    
    let uploadPath = path.join(__dirname, `../public/images/${req.files.photos.name}`);
    req.files.photos.mv(uploadPath, (err) => {
      if (err) {
        throw err;
      }
    })
    
    db.query(
      `INSERT INTO items (name, buyprice, sellprice, stock, photos) VALUES ('${req.body.name}', 
      ${req.body.buy}, ${req.body.sell}, ${req.body.stock}, '${baseUrl}/images/${req.files.photos.name}')`,
      (err, data) => {
        if (err) {
        
          res.status(201).json({
            success: false,
            message: "something wrong",
            err,
          });
        }
    
        res.status(200).json(data);
      }
    )};
  });

  router.delete("/:id", (req, res) => {

    db.query(
      `DELETE FROM items WHERE itemid=$1`,
      [parseInt(req.params.id)],
      (err, data) => {
        if (err) {
          res.status(201).json({
            success: false,
            message: "something wrong",
            err,
          });
        }

        res.status(200).json(data);
      }
    );
  });

  router.get("/:id", (req, res) => {
    db.query(
      `select * from items where itemid=$1`,
      [parseInt(req.params.id)],
      (err, row) => {
        if (err) {
          res.status(201).json({
            success: false,
            message: "something wrong",
            err,
          });
        }

        res.status(200).json(row);
      }
    );
  });

  router.put("/:id", (req, res) => {
    if(req.files.photos.size <= 100000){
      var baseUrl = `http://${req.headers.host}`;
    
      let uploadPath = path.join(__dirname, `../public/images/${req.files.photos.name}`);
      req.files.photos.mv(uploadPath, (err) => {
        if (err) {
          throw err;
        }
      })
    
    db.query(
      `UPDATE items 
      SET name = '${req.body.name}', buyprice = ${req.body.buy}, 
      sellprice = ${req.body.sell},
      stock = ${req.body.stock}, photos = '${baseUrl}/images/${req.files.photos.name}'
      WHERE itemid=${req.params.id}`,
      (err, data) => {
        if (err) {
          res.status(201).json({
            success: false,
            message: "something wrong",
            err,
          });
        }
        
        res.status(200).json(data);
      }
    )};
  });

  

  return router;
};
