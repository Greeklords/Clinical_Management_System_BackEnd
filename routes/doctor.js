const router= require("express").Router();
let Doctor=require("../modles/doctor.js");
router.route("/add").post((req,res)=>{

    const specialization=req.body.specialization;
    const doctorname=req.body.doctorname;
    const date=Date(req.body.date);
    const charges=Number(req.body.charges);
    const firstname=req.body.firstname;
    const lastname=req.body.lastname;
    const age=Number(req.body.age);
    const mobileno=Number(req.body.mobileno);
    const address=req.body.address;

    const newdoctor=new Doctor({

        specialization,
        doctorname,
        date,
        charges,
        firstname,
        lastname,
        age,
        mobileno,
        address
    })

//data add 
        newdoctor.save().then(()=>{
        res.json("Doctor details Added")
    }).catch((err)=>{
        console.log(err);
    })

})
//read data
router.route("/").get((req,res)=>{

    Doctor.find().then((doctor)=>{
        res.json(doctor)
    }).catch((err)=>{
        console.log(err);
    })
})
//update
router.route("/update/:id").put(async(req,res)=>{
    let userId=req.params.id;
    const{specialization,doctorname,date,charges,firstname,lastname,age,mobileno,address}=req.body;

    const updateDoctor={
        specialization,
        doctorname,
        date,
        charges,
        firstname,
        lastname,
        age,
        mobileno,
        address
    }

    const update=await Doctor.findByIdAndUpdate(userId,updateDoctor).then(()=>{
        res.status(200).send({status:"Doctor details update"})
    }).catch((err)=>{
        res.status(500).send({status:"error with updating data",error:err.message});
    })
})
//delete

router.route("/delete/:id").delete(async(req,res)=>{
    let userId = req.params.id;

    await Doctor.findByIdAndDelete(userId)
    .then(()=>{
        res.status(200).send({status:"Doctor details deleted"});
    }).catch((err)=>{
        res.status(500).send({status:"error with delete user",error:err.message});
    })
})

//get one user data

router.route("/get/:id").get(async(req,res)=>{
    let userId = req.params.id;
    const user=await Patient.findById(userId) 
    .then((patient)=>{
        res.status(200).send({status:"User fetched",patient})
    }).catch((err)=>{
        console.log(err.message);
        res.status(500).send({status:"error with get user",error:err.message})
    })
})

module.exports=router;