import multer from "multer";

const storage = multer.diskStorage({
    destination: function(req,file,cd){
        cd(null,"./public/temp");
    },
    filename: function(req,file,cb){
        cb(null,file.originalname + "_" + Math.round(Math.random()*1E9));
    }
})

export const upload = multer({ storage: storage});