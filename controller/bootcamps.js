//@desc         will show all the bootcamps
//@route        GET on /api/v1/bootcamps/
//access        public
exports.getBootcamps = (req,res,next) =>{
    console.log("hello world")
    res.end()
}
//@desc         will show selected bootcamps
//@route        GET on /api/v1/bootcamps/:id
//access        public
exports.getBootcamp = (req,res,next) =>{
    console.log("hello one")
    res.end()
}
//@desc         create bootcamps
//@route        post on /api/v1/bootcamps/
//access        private
exports.createBootcamps = (req,res,next) =>{
    console.log("created")
    res.end()
}
//@desc         update selected bootcamps
//@route        put on /api/v1/bootcamps/:id
//access        private
exports.updateBootcamps = (req,res,next) =>{
    console.log("updated")
    res.end()
}
//@desc         will delete the selected bootcamp useing id
//@route        delete on /api/v1/bootcamps/:id
//access        private
exports.deleteBootcamps = (req,res,next) =>{
    console.log("deleted")
    res.end()
}