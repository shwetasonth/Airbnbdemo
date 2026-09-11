const mongoose = require("mongoose");
const initdata= require("./data.js");

const Listing = require("../Models/listing.js");
//connection to mongodb
const MONGO_URL = "mongodb://127.0.0.1:27017/AirbnbDB";
async function main() {
  mongoose.connect(MONGO_URL);
}

main()
  .then(() => {
    console.log("Connection established successfully!!!");
  })
  .catch((err) => console.log(err));

  async function initdb(){
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((ob) => ({
      ...ob,
      owner: "6a9a974b1d07b69a9f168eb0",
    }));
    await Listing.insertMany(initdata.data).then(()=>{
      console.log("data initialized successfull")
    }).catch(err=>console.log(err));
    
  }

  initdb();