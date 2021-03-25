const multer = require('multer');
const path = require('path');

const storage=multer.diskStorage({
    destination:'public/uploads/',
    filename:(req,file,cb)=>{
        cb(null,`file ${Date.now()}${path.extname(file.originalname)}`);
    }
})


const uploads=multer({storage});


module.exports=uploads;