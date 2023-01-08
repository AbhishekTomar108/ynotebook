const express = require('express')
const Notes = require("../models/Notes");
const router = express.Router();
var fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require("express-validator");
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Route-1 get all the notes :"GET /api/notes/fetchallnotes". Log required
router.get('/fetchallnotes',fetchuser, async (req,res)=>
{
    try{
   const notes  = await Notes.find({user:req.user.id})
   
   res.json(notes);
    }
    catch(error){
        console.error(error.message)
    }
    // res.json([])
})

// Route-2 Add a new notes :"POST /api/notes/addnotes". Log required

router.post('/addnotes',fetchuser,[
    body("title").isLength({min:5}),
    body("description", "valid description").isLength({min:5}),
    body("tag").isLength({ min: 5 }),
],
 async (req,res)=>
{
    try{
    const {title, description, tag} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } 
    const note = new Notes({
        title, description, tag, user:req.user.id
    })  
    const savednote = await note.save();
    res.json(savednote)
}
catch(error){
    console.error(error.message);
    res.status(500).send('internal server error');
}
})

// Route-3 update notes :"put /api/notes/updatenotes". Log required
router.put('/updatenotes/:id',fetchuser, async (req,res)=>
{
    try{
    const {title, description, tag} = req.body;
    //create new notes object
    const newnote = {};
    if(title){newnote.title=title};
    if(description){newnote.description=description};
    if(tag){newnote.tag=tag};

    // find the new note to be updated and update it
 let note = await Notes.findById(req.params.id);
   if(!note){return res.status(404).send("not found "+note)}

   if(note.user.toString() !== req.user.id){
    return res.status(401).send('Not Allowed '+note.user.toString()+" "+req.user.id);
   }

   note = await Notes.findByIdAndUpdate(req.params.id,{$set:newnote});
   res.json({note});
}
catch(error){
    console.error(error.message);
    res.status(500).send('internal server error');
}
})

// Route-4 delete notes :"delete /api/notes/deletenotes". Log required
router.delete('/deletenotes/:id',fetchuser, async (req,res)=>
{
    try{
        // find the new note to be deleted and delete it
 let note = await Notes.findById(req.params.id);
   if(!note){return res.status(404).send("not found "+note)}

   // allow deletion only user is right
   if(note.user.toString() !== req.user.id){
    return res.status(401).send('Not Allowed '+note.user.toString()+" "+req.user.id);
   }

   note = await Notes.findByIdAndDelete(req.params.id);
   res.json({"Success":"notes has been deleted ",note:note});
}
catch(error){
    console.error(error.message);
    res.status(500).send('internal server error');
}
})


module.exports = router