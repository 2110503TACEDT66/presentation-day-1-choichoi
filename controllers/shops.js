const Shop = require('../models/Shop');
const Reservation = require('../models/Reservation');
//const vacCenter = require('../models/VacCenter');
//@desc Get all shops
//@route GET /api/v1/shops
//@access Public
exports.getShops= async (req,res,next)=>
{
    let query;
    const reqQuery = {...req.query};
    const removeField=['select','sort','page','limit'];

    removeField.forEach(param=>delete reqQuery[param]);
    console.log(reqQuery);
    let queryStr=JSON.stringify(reqQuery);
    queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=>`$${match}`);
        
    query=Shop.find(JSON.parse(queryStr)).populate('reservations');

    if(req.query.select)
    {
        const fields = req.query.select.split(',').join(' ');
        query=query.select(fields);
    }
    if(req.query.sort)
    {
        const sortBy = req.query.sort.split(',').join(' ');
        query=query.sort(sortBy);
    }else
    {
        query=query.sort('-createdAt');
    }
    const page = parseInt(req.query.page,10)||1;
    const limit = parseInt(req.query.limit,10)||25;
    const startIndex=(page-1)*limit;
    const endIndex=page*limit;
    
    try
    {
        const total = await Shop.countDocuments();
        query=query.skip(startIndex).limit(limit);

        const shops = await query;

        const pagination = {};

        if(endIndex<total)
        {
            pagination.next=
            {
                page:page+1,
                limit
            }
        }

        if(startIndex>0)
        {
            pagination.prev=
            {
                page:page-1,
                limit
            }
        }

        res.status(200).json({success:true,cout:shops.length, pagination, data:shops})
    }catch(err)
    {
        res.status(400).json({success:false});
    }
}

//@desc Get shop
//@route GET /api/v1/shops/:id
//@access Public
exports.getShop= async (req,res,next)=>
{
    try
    {
        const shop = await Shop.findById(req.params.id);

        if(!shop)
        {
            return res.status(400).json({success:false});
        }
       res.status(200).json({success:true,data:shop});
    }catch(err)
    {
        res.status(400).json({success:false});
    }
}

//@desc Create a shop
//@route POST /api/v1/shops
//@access Private
exports.createShop= async (req,res,next)=>
{
    console.log(req.body);
    const shop = await Shop.create(req.body);
    res.status(201).json(
        {
            success:true, data:shop
        })
}

//@desc Update a shop
//@route PUT /api/v1/shops/:id
//@access Private
exports.updateShop= async (req,res,next)=>
{
    try{
        
        let shop = await Shop.findById(req.params.id);
        if(!shop)
        {
            return res.status(404).json({success:false,msg:"Shop not found"});
        }

        if(req.user.manageShop.toString() !== shop.id && req.user.role=='shopkeeper'){
            return res.status(401).json({success:false,msg:"Not authorized to update other shop"});
        }

        const reservation = await Reservation.find({shop:shop.id});

        if(reservation.length>0){
            return res.status(400).json({success:false,msg:"Cannot update shop that has reservation"});
        }


        shop = await Shop.findByIdAndUpdate(req.params.id, req.body,
            {
                new: true,
                runValidators: true
            });

        
        res.status(200).json({success:true, data:shop});
    
    }catch(err)
    {
        console.log(err.stack);
        res.status(400).json({success:false});
    }

}

//@desc Delete a shop
//@route POST /api/v1/shops/:id
//@access Private
exports.deleteShop= async(req,res,next)=>
{
    try
    {
        const shop = await Shop.findById(req.params.id);

        if(!shop)
        {
            return res.status(404).json({success:false,message:`Bootcamp not found with id of ${req.params.id}`});
        }
        await shop.deleteOne();
        res.status(200).json({success:true, data:{}});
    }catch(err)
    {
        console.log(err.stack);
        res.status(400).json({success:false});
    }
}

/** exports.getVacCenters=(req,res,next)=>
{
    vacCenter.getAll((err,data)=>
    {
        if(err)
        {
            res.status(500).send(
                {
                    message:
                        err.message||"Some error occurred while retrieving Vaccine Centers."
                });
        }else res.send(data);
    });
};
*/

