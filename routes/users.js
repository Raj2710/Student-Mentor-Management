var express = require('express');
const { MongoClient } = require('mongodb');
var router = express.Router();
const {dbUrl,mongodb,MongClient, Mongoclient}=require("../bin/config");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/all-students",async(req,res)=>{
  const client = await MongoClient.connect(dbUrl);
  try {
      const db = client.db("StudentMentor");
      const user = await db.collection("student").find().toArray();
      res.status(200).send(user);
  } catch (error) {
      res.json(error);
  }finally{
    client.close();
  }
})

router.get("/all-mentors",async(req,res)=>{
  const client = await MongoClient.connect(dbUrl);
  try {
      const db = client.db("StudentMentor");
      const user = await db.collection("mentor").find().toArray();
      res.status(200).send(user);
  } catch (error) {
      res.json(error);
  }finally{
    client.close();
  }
})

router.post("/add-mentor",async(req,res)=>{
  const client = await MongoClient.connect(dbUrl);
  try {
      const db = client.db("StudentMentor");
      const user = db.collection("mentor").insertOne(req.body);
      res.status(200).json({
        message:"Mentor Added Successfully!"
      })
  } catch (error) {
      res.status(500).json(error);
  }finally{
    client.close();
  }
})
router.post("/add-student",async(req,res)=>{
  const client = await MongoClient.connect(dbUrl);
  try {
      const db = client.db("StudentMentor");
      const user = db.collection("student").insertOne(req.body);
      res.status(200).json({
        message:"Student Added Successfully"
      })
  } catch (error) {
      res.status(500).json(error);
  }finally{
    client.close();
  }
})
module.exports = router;
