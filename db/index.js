const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://dharunn:snehamurali@moviereview.hl57pfh.mongodb.net/?retryWrites=true&w=majority').then(
    ()=>{
        console.log("db is connected successfully hii")
    }

).catch((e)=>{
    console.log(e)
})