const dotenv= require('dotenv')
dotenv.config({path:'./config/config.env'})
const NodeGeocoder=require('node-geocoder')
const options={
    provider:process.env.GEOCODER_PROVIDER,
    httpAdapter:'https',
    apiKey: process.env.API_KEY,
    formatter:null
};
const geocoder =NodeGeocoder(options);
console.log(options)
module.exports=geocoder