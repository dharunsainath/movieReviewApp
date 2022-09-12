const User = require("../models/user")
const EmailVerification = require("../models/emailVerification")
const nodeMailer = require("nodemailer")
const {isValidObjectId} = require('mongoose')
exports.create = async (req, res) => {
  const {name,email,password}=req.body

  

  const newUser = new User({name,email,password})

  const oldUser = await User.findOne({email})

  if(oldUser) {
    res.status(401).json({error: "user already registered"})
  }

  await newUser.save()
  

  //generate 6 digit otp
  let otp =''

  for(let i=0;i<=5;i++){
  const randomVal=Math.round(Math.random()*9)
  otp+=randomVal
  }

  const newEmailVerificationToken = new EmailVerification({
  owner: newUser._id,
  token: otp
})



await newEmailVerificationToken.save()

var transport = nodeMailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "082eafaf61ad27",
    pass: "b218ddd574e2ce"
  }
});

transport.sendMail(
  {
    from: 'dharunnsainath@gmail.com',
    to: newUser.email,
    subject:"verification email",
    html:`
    <p>your otp</p>
    <h1>${otp}</h1>
    `
  }
)
res.status(201).json({message: "please verify"})
};

exports.verifyEmail =async (req,res)=>{
  const {userId , otp} = req.body

  if(!isValidObjectId(userId))
  {
    return res.json({error: "invalid user"})
  }

  const user = await User.findById(userId)

  if(!user)
  {
    return res.json({error: "user not found"})
  }

  if(user.isVerified)
  {
    return res.json({error: "user already verified"})
  }

  const token = await EmailVerification.findOne({owner: userId})

  if(!token)
  {
    return res.json({error: "token  not found"})
  }

  const isMatched = await token.compareToken(otp)
  if(!isMatched){
    return res.json({error: "token not matched"})
  }

  user.isVerified = true

  await user.save()

  EmailVerification.findByIdAndDelete(token._id)

  res.json({message: "email is verified"})


}


exports.resendEmailVerification = async (req,res)=>{
  const {userId} = req.body;

  const user = await User.findById(userId)
  if(!user){
    return res.json({error: "user not found"})
  }
   
  if(user.isVerified)
  {
    return res.json({error: "user already verified"})
  }

  const alreadyHasToken = await EmailVerification.findOne({owner: userId})

  if(alreadyHasToken)
  {
    res.json({error: "only after 1 hour you can request for another token"})
  }

  let OTP = "";
  for (let i = 1; i <= 5; i++) {
    const randomVal = Math.round(Math.random() * 9);
    OTP += randomVal;
  }

  // store otp inside our db
  const newEmailVerificationToken = new EmailVerification({ owner: user._id, token: OTP })

  await newEmailVerificationToken.save()

  // send that otp to our user

  var transport = nodeMailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "f29ed41f1f4bd3",
      pass: "db3edd88e2927f"
    }
  });

  transport.sendMail({
    from: 'verification@reviewapp.com',
    to: user.email,
    subject: 'Email Verification',
    html: `
      <p>You verification OTP</p>
      <h1>${OTP}</h1>
    `
  })

  res.json({
    message: "New OTP has been sent to your registered email accout.",
  });

}
