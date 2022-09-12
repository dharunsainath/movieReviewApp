const {check, validationResult} = require("express-validator")

exports.userValidator = 
[
    check('name').trim().not().isEmpty().withMessage("name is empty"), 
    check("email").normalizeEmail().isEmail().withMessage("email is invalid da"), 
    check("password").trim().not().isEmpty().withMessage("password is empty").isLength({min: 8,max: 20}).withMessage("password must be more than 8 characaters and less than 20 characters")
]

exports.validate =(req,res,next)=>{
    const error = validationResult(req).array()
    console.log(error)

    if(error.length)
    {
        return res.json(error[0].msg)
    }

    next()
}