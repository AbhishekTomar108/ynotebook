const express = require('express')
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');



router.post('/',[
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('name').isLength({ min: 5 })
], async(req,res)=>{
   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // check whether email is already is exist
    try{
    let user = await User.findOne({email:req.body.email});
    if(user)
    {
        return res.status(400).json({error:"sorry a user with this email is already is exist"});
    }
    user = await User.create({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email
      })
      res.json({"result":"done"}); 
    }
    //   .then(user => res.json(user));
    // res.send(req.body);
    // const user = User(req.body);
    // user.save();
catch(error)
{
    console.error(error.message);
    res.status(500).send("some error occured");
}
})

module.exports = router