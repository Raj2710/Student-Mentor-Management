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

router.post("/mentor",async(req,res)=>{
  const client = await MongoClient.connect(dbUrl);
  try {
      const db = client.db("StudentMentor");
      const user = await db.collection("student").findOne({"studentName":req.body.studentName});
      res.status(200).json(user);
  } catch (error) {
      res.json(error);
  }finally{
    client.close();
  }
})

router.post("/students",async(req,res)=>{
  const client = await MongoClient.connect(dbUrl);
  try {
      const db = client.db("StudentMentor");
      const user = await db.collection("mentor").findOne({"mentorName":req.body.mentorName});
      res.status(200).json(user);
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
      if(req.body.mentorStudents){
        req.body.mentorStudents.map(async(e)=>{
          const stu = await db.collection("student").updateOne({"studentName":e},{$set:{"studentMentor":req.body.mentorName}});
        })
      }
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
      if(req.body.studentMentor){
        const men = await db.collection("mentor").findOne({"mentorName":req.body.studentMentor});
        men.mentorStudents.push(req.body.studentName);
        const update = await db.collection("mentor").updateOne({"mentorName":req.body.studentMentor},{$set:{"mentorStudents":men.mentorStudents}});
      }
      res.status(200).json({
        message:"Student Added Successfully"
      })
  } catch (error) {
      res.status(500).json(error);
  }finally{
    client.close();
  }
})

router.post("/assign-students",async(req,res)=>{
  const client = await MongoClient.connect(dbUrl);
  try {
      const db = client.db("StudentMentor");
      if(req.body.mentorStudents){//updating mentor Name for all students
        req.body.mentorStudents.map(async(e)=>{
          const stu = await db.collection("student").updateOne({"studentName":e},{$set:{"studentMentor":req.body.mentorName}});
        })
      }
      if(req.body.mentorName){//updating students name for selected mentor
        const men = await db.collection("mentor").findOne({"mentorName":req.body.mentorName});
        console.log(men.mentorStudents);
        req.body.mentorStudents.map((i)=>{
          men.mentorStudents.push(i);
        })
        console.log(men.mentorStudents);
        const update = await db.collection("mentor").updateOne({"mentorName":req.body.mentorName},{$set:{"mentorStudents":men.mentorStudents}});
      }
      res.status(200).json({
        message:"Mentor and Students Mapped Successfully!"
      })
  } catch (error) {
      res.status(500).json(error);
  }finally{
    client.close();
  }
})


router.post("/change-mentor",async(req,res)=>{
  const client = await MongoClient.connect(dbUrl);
  try {
      const db = client.db("StudentMentor");
      const men = await db.collection("mentor").findOne({"mentorName":req.body.oldMentor});
      men.mentorStudents.splice(men.mentorStudents.indexOf(req.body.studentName),1);
      const update = await db.collection("mentor").updateOne({"mentorName":req.body.oldMentor},{$set:{"mentorStudents":men.mentorStudents}});
      const user = await db.collection("student").updateOne({"studentName":req.body.studentName},{$set:{"studentMentor":req.body.mentorName}});
      const newmen = await db.collection("mentor").findOne({"mentorName":req.body.mentorName});
      newmen.mentorStudents.push(req.body.studentName);
      const newupdate = await db.collection("mentor").updateOne({"mentorName":req.body.mentorName},{$set:{"mentorStudents":newmen.mentorStudents}});
      res.status(200).json({
        message:"Mentor Changed Successfully!"
      })
  } catch (error) {
      res.status(500).json(error);
  }finally{
    client.close();
  }
})

module.exports = router;
