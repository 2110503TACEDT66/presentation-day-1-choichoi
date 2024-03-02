const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50,'Name can not be more than 50 characters']
    },
    address: {
        type: String,
        require: [true, 'Please add an address']
    },
    tel: {
        type: String,
        require: [true, 'Please add a telephone number']
    },
    open_time: {
        type: Int32Array,
        require: [true, 'Please add a open-time']

    },
    close_time: {
        type: Int32Array,
        require: [true, 'Please add a close-time']
    }
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

//Reverse populate with virtuals
ShopSchema.virtual('reservations',{
    ref: 'Reservation',
    localField: '_id',
    foreignField:'shop',
    justOne:false
});

//Cascade delete reservations when a shop is deleted
ShopSchema.pre('deleteOne',{document:true,query: false}, async function(next){
    console.log(`Reservations being removed from shop ${this._id}`);
    await this.model('Reservation').deleteMany({shop:this._id});
    next();
});

module.exports=mongoose.model('Shop',ShopSchema);