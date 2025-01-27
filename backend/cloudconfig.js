const cloudinary= require('cloudinary').v2;
const {CloudinaryStorage} =require('multer-storage-cloudinary');
require('dotenv').config()


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_SECRET_KEY,
});

 
const storage =new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:'Intagram_clone',
        allowerdFormats:["png","jpg","jpeg"],
    },
});

module.exports={cloudinary,storage}