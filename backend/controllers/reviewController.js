import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Review from "../models/Review.js";

export const createReview = async (req, res) => {
    try {
        const { bookingId, rating, comment } = req.body;

        if(!bookingId || !rating){
            return res.status(400).json({
                success: false,
                message: "Booking id and rating are required"
            })
        }

        // validate the bookingId
        if(!mongoose.Types.ObjectId.isValid(bookingId)){
            return res.status(400).json({
                success: false,
                message: "Invalid Booking ID"
            })
        }

        // validate the rating value
        if(!Number.isInteger(rating) || rating < 1 || rating > 5){
            return res.status(400).json({
                success: false,
                message: "Invalid rating value"
            })
        }

        // Check the booking is existing
        const existingBooking = await Booking.findById(bookingId)

        if(!existingBooking){
            return res.status(400).json({
                success: false,
                message: "Booking not found!"
            })
        }

        // Øwnership of the booking
        if(existingBooking.customer.toString() !== req.user._id.toString()){
            return res.status(400).json({
                success: false,
                message: "You are not allowed to review this booking"
            })
        }

        // check whether the booking status is completed -
        // Only completed booking can have review 
        if(existingBooking.status !== "completed"){
            return res.status(400).json({
                success: false,
                message: "Only completed bookings can be reviewed"
            })
        }

        // Check if review existing 
        const existingReview = await Review.findOne({
            booking: existingBooking._id
        })

        if(existingReview){
            return res.status(400).json({
                success: false,
                message: "Review already exists"
            })
        }

        const review = await Review.create({
            customer: existingBooking.customer,
            provider: existingBooking.provider,
            service: existingBooking.service,
            booking: existingBooking._id,
            rating,
            comment: comment.trim()
        })

        res.status(200).json({
            success: true,
            message: "Review is added",
            review
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `Internal server error ${error}`
        })
    }
}

export const getServiceReviews = async (req, res) => {
    try {
        const { serviceId } = req.params;

        // Validate service Id
        if(!mongoose.Types.ObjectId.isValid(serviceId)){
            res.status(400).json({
                success: false,
                message: "Invalid service!"
            })
        }

        // retrive bokkings under this service,
        const reviews = await Review.find({
            service: serviceId
        }).populate("customer", "name")

        if(!reviews){
            res.status(400).json({
                success: false,
                message: "No reviews found!"
            })
        }

        const totalReviews = reviews.length;
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)

        const averageRating = totalReviews > 0 ? Number((totalRating / totalReviews).toFixed(1)) : 0;

        console.log("total review and rating, average rating", totalReviews, totalRating, averageRating);
        
        res.status(200).json({
            success: true,
            summary: {
              averageRating,
              totalReviews,
            },
            reviews,
        });
      
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}