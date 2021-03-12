const express = require('express');
const router = express.Router();

router.get('/' , (req,res) =>{
    console.log("hello world")
    res.end()

});
router.get('/:id' , (req,res) =>{
    console.log("hello one")
    res.end()
})
router.post('/' , (req,res) =>{
    console.log("created")
    res.end()
})
router.put('/:id' , (req,res) =>{
    console.log("updated")
    res.end()
})
router.delete('/:id' , (req,res) =>{
    console.log("deleted")
    res.end()
})







module.exports = router;