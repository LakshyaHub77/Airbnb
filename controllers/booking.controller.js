import Listing from "../models/listing.model.js";
import Booking from "../models/booking.model.js";
import User from "../models/user.model.js";

export const createBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { checkIn, checkout, totalRent } = req.body;

        console.log("📅 New booking attempt:", { checkIn, checkout });

        const listing = await Listing.findById(id);
        if (!listing) return res.status(404).json({ message: "Listing not found" });

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkout);

        // ✅ CORRECT OVERLAP CHECK - Exact dates only
        const overlappingBookings = await Booking.find({
            listingId: id,
            // Exact date match OR partial overlap
            $or: [
                {
                    checkIn: { $eq: checkInDate },
                    checkOut: { $eq: checkOutDate }
                },
                {
                    checkIn: { $lt: checkOutDate },
                    checkOut: { $gt: checkInDate }
                }
            ]
        });

        if (overlappingBookings.length > 0) {
            console.log("❌ Overlap found:", overlappingBookings[0]);
            return res.status(400).json({ 
                message: `Dates ${checkIn} to ${checkout} are already booked` 
            });
        }

        // ✅ CREATE BOOKING
        const booking = await Booking.create({
            listingId: id,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            totalRent: Number(totalRent),
            host: listing.host,
            guest: req.userId,
            status: "booked"
        });

        await User.findByIdAndUpdate(req.userId, { $push: { booking: booking._id } });

        console.log("✅ NEW BOOKING CREATED:", booking._id);
        res.status(201).json({ 
            message: "Booking successful!", 
            booking 
        });

    } catch (error) {
        console.error("Booking error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
