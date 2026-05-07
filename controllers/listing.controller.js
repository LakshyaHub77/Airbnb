import uploadOnCloudinary from "../config/cloudinary.js";
import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
export const addListing=async (req,res)=>{
    try {





        let host=req.userId;
        let {title,description,rent,city,landmark,category}=req.body
        let image1=await uploadOnCloudinary(req.files.image1[0].path)
        let image2=await uploadOnCloudinary(req.files.image2[0].path)
        let image3=await uploadOnCloudinary(req.files.image3[0].path)
let listing=await Listing.create({

title,description,rent,city,landmark,category,image1,image2,image3,host


})
let user=await User.findByIdAndUpdate(host,{$push:{listing:listing._id}},{new:true})
if(!user){
  return  res.status(400).json({message:"User not found"})

}
return res.status(200).json(listing)
    } catch (error) {
 return res.status(500).json({message:`add Listing Error ${error}`})   
    }
}


export const getListing=async(req,res)=>{

    try {
        let listing=await Listing.find().sort({createdAt:-1}).populate('host', 'name email') 
    return    res.status(200).json(listing)
        
    } catch (error) {
    return    res.status(500).json({message:`Get listing error ${error}`})
        
    }
}

export const findListing=async(req,res)=>{
    try {
        let {id}=req.params
        let listing=await Listing.findById(id)
        if(!listing){
         return   res.status(400).json({message:"listing not found"})
        }
return  res.status(200).json(listing)


    } catch (error) {
                 return   res.status(500).json(`findlisting error ${error}`)

    }
}



export const updateListing = async (req, res) => {
    try {
        let { id } = req.params;  // ✅ ID from URL params
        
        // ✅ Handle optional image uploads
        let image1, image2, image3;
        if (req.files?.image1) {
            image1 = await uploadOnCloudinary(req.files.image1[0].path);
        }
        if (req.files?.image2) {
            image2 = await uploadOnCloudinary(req.files.image2[0].path);
        }
        if (req.files?.image3) {
            image3 = await uploadOnCloudinary(req.files.image3[0].path);
        }

        // ✅ Update object (only updated fields)
        const updateData = {
            title: req.body.title,
            description: req.body.description,
            rent: Number(req.body.rent),
            city: req.body.city,
            landmark: req.body.landmark,
            category: req.body.category
        };

        // ✅ Add images only if uploaded
        if (image1) updateData.image1 = image1;
        if (image2) updateData.image2 = image2;
        if (image3) updateData.image3 = image3;

        // ✅ CORRECT SYNTAX: findByIdAndUpdate(id, update, options)
        let listing = await Listing.findByIdAndUpdate(
            id,                    // ✅ 1st arg: ID from params
            updateData,           // ✅ 2nd arg: Update data
            { new: true }         // ✅ 3rd arg: Options
        );

        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        return res.status(200).json(listing);  // ✅ 200 for success
    } catch (error) {
        return res.status(500).json({ message: `Update error: ${error.message}` });
    }
};


export const deleteListing=async(req,res)=>{
try {
    let {id}=req.params

    let listing=await Listing.findByIdAndDelete(id)
    let user=await User.findByIdAndUpdate(listing.host,{
        $pull:{listing:listing._id}
    },{new:true})
    if(!user){
        return res.status(404).json({message:"User not found"})
    }
    return res.status(200).json({message:"Listing Deleted"})








} catch (error) {
        return res.status(500).json({message:" Delete listing error"})

}

}