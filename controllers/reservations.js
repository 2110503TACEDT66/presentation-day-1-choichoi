const Reservation = require('../models/Reservation');
const Shop = require('../models/Shop');
exports.getReservations=async (req,res,next)=>
{
    let query;

    if(req.user.role !== 'admin')
    {
        query=Reservation.find({user:req.user.id}).populate(
            {
                path:'shop',
                select:'name province tel open_close_time'
            });
    }else
    {
        if(req.params.shopId)
        {
            console.log(req.params.shopId);
            query = Reservation.find({shop:req.params.shopId}).populate(
                {
                    path:"shop",
                    select:"name province tel open_close_time",
                });
        }else
        {
            query=Reservation.find().populate(
                {
                    path:'shop',
                    select:'name province tel open_close_time'
                });
        }
        
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
                select:'name description tel open_close_time'
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

        if(existedReservations.length>=3&&req.user.role!=='admin')
        {
            return res.status(400).json({success:false, message:`The user with ID ${req.user.id} has already made 3 reservations`});
        }

        const appointment = await Appointment.create(req.body);

        res.status(200).json({success:true,data:appointment});
    }catch(err)
    {
        console.log(err);

        return res.status(500).json({success:false,message:"Cannot create Appointment"});3
    }
}

exports.updateAppointment=async (req,res,next)=>
{
    try
    {
        let appointment=await Appointment.findById(req.params.id);
        if(!appointment)
        {
            return res.status(404).json({success:false,message:`No appointment with the id ofg ${req.params.id}`});
        }

        if(appointment.user.toString()!==req.user.id&&req.user.role!=='admin')
        {
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to update this appointment`})
        }

        appointment = await Appointment.findByIdAndUpdate(req.params.id,req.body,
            {
                new:true,
                runValidators:true
            });

        res.status(200).json({success:true,data:appointment});
    }catch(err)
    {
        console.log(err);
        return res.status(500).json({success:false,message:"Cannot updata Appointment"});
    }
}

exports.deleteAppointment=async (req,res,next)=>
{
    try
    {
        let appointment=await Appointment.findById(req.params.id);
        if(!appointment)
        {
            return res.status(404).json({success:false,message:`No appointment with the id og ${req.params.id}`});
        }

        if(appointment.user.toString()!==req.user.id&&req.user.role!=='admin')
        {
            return res.status(401).json({success:false,message:`USer ${req.user.id} is not authorized to delete this`})
        }

        await appointment.deleteOne();

        res.status(200).json({success:true,data:{}});
    }catch(err)
    {
        console.log(err);
        return res.status(500).json({success:false,message:"Cannot delete Appointment"});
    }
}
