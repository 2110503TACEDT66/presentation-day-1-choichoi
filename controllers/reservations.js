const Reservation = require('../models/Reservation');
const Shop = require('../models/Shop');
const User = require("../models/User");
exports.getReservations=async (req,res,next)=>
{
    let query;
    //get as a user
    if(req.user.role == 'user')
    {
        query=Reservation.find({user:req.user.id}).populate(
            {
                path:'shop',
                select:'name province tel open_time close_time'
            });
    //get as an admin
    }else if(req.user.role == 'admin')
    {
        if(req.params.shopId)
        {
            console.log(req.params.shopId);
            query = Reservation.find({shop:req.params.shopId}).populate(
                {
                    path:"shop",
                    select:"name province tel open_time close_time",
                });
        }else
        {
            query=Reservation.find().populate(
                {
                    path:'shop',
                    select:'name province tel open_time close_time'
                });
        }
    //get as a shopkeeper
    }else{
        const shopkeeper = await User.findById(req.user.id);
        query = Reservation.find({shop:shopkeeper.manageShop}).populate(
            {
                path:"shop",
                select:"name province tel open_time close_time",
            });
    }
    try
    {
        const reservations = await query;

        res.status(200).json({success:true, count:reservations.length, data:reservations});
    }catch(err)
    {
        console.log(err.stack);
        return res.status(500).json({success:false,message:"Cannot find Reservation"});
    }
};

exports.getReservation = async (req,res,next)=>
{
    try
    {
        const reservation = await Reservation.findById(req.params.id).populate(
            {
                path:'shop',
                select:'name description tel open_time close_time'
            });
        if(!reservation)
        {
            return res.status(404).json({success:false,message:`No reservation with the id of ${req.params.id}`});
        }

        
        res.status(200).json(
            {
                success:true,
                data:reservation
            });
    }catch(err)
    {
        console.log(err);
        return res.status(500).json({success:false,message:"Cannot find Reservation"});
    }
}

exports.addReservation=async (req,res,next)=>
{
    try
    {
        req.body.shop = req.params.shopId;

        const shop = await Shop.findById(req.params.shopId);

        if(!shop)
        {
            return res.status(404).json({success:false,message:`No shop with the id of ${req.params.shopId}`});
        }

        req.body.user = req.user.id;
        const existedReservations = await Reservation.find({user:req.user.id});

        if(existedReservations.length>=3&& req.user.role !== 'admin')
        {
            return res.status(400).json({success:false, message:`The user with ID ${req.user.id} has already made 3 reservations`});
        }

        const myDate = new Date(req.body.date);

        // check การจองเวลาในอดีต
        if(myDate < Date.now()){
            return res.status(400).json({success:false,message:'Cannot make a reservation in the past'});
        }
        
        // check การจองเวลาตอนร้านปิด
        const hours = myDate.getUTCHours();
        const minutes = myDate.getUTCMinutes(); 
        const time =  hours*60+minutes;

        if(time < shop.open_time || time > shop.close_time){
            return res.status(400).json({success:false,message:'The shop is close during your reservation'});
        }


        const reservation = await Reservation.create(req.body);

        res.status(200).json({success:true,data:reservation});
    }catch(err)
    {
        console.log(err);

        return res.status(500).json({success:false,message:"Cannot create Reservation"});3
    }
}

exports.updateReservation=async (req,res,next)=>
{
    try
    {
        let reservation=await Reservation.findById(req.params.id);
        if(!reservation)
        {
            return res.status(404).json({success:false,message:`No reservation with the id ofg ${req.params.id}`});
        }

        if(reservation.user.toString()!==req.user.id&&req.user.role!=='admin')
        {
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to update this reservation`})
        }

        reservation = await Reservation.findByIdAndUpdate(req.params.id,req.body,
            {
                new:true,
                runValidators:true
            });

        res.status(200).json({success:true,data:reservation});
    }catch(err)
    {
        console.log(err);
        return res.status(500).json({success:false,message:"Cannot update Reservation"});
    }
}

exports.deleteReservation=async (req,res,next)=>
{
    try
    {
        let reservation=await Reservation.findById(req.params.id);
        if(!reservation)
        {
            return res.status(404).json({success:false,message:`No reservation with the id og ${req.params.id}`});
        }

        if(reservation.user.toString()!==req.user.id&&req.user.role!=='admin')
        {
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to delete this`})
        }

        await reservation.deleteOne();

        res.status(200).json({success:true,data:{}});
    }catch(err)
    {
        console.log(err);
        return res.status(500).json({success:false,message:"Cannot delete Reservation"});
    }
}
