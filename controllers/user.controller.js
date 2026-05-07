import User from "../models/user.model.js"
import mongoose from "mongoose"

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .select("-password")
            .populate('listing', 'title image1 image2 image3 description rent category city landmark isBooked host ratings')
            .populate({
                path: 'booking',
                populate: {
                    path: 'listingId',
                    model: 'Listing',
                    select: 'title image1 image2 image3 description rent category city landmark ratings'
                }
            });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        return res.status(200).json({ 
            success: true, 
            user 
        });
        
    } catch (error) {
        return res.status(500).json({ 
            message: "Server error", 
            error: error.message 
        });
    }
}
