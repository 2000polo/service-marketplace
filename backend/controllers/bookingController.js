import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Service from "../models/Service.js";
import { canTransitionBookingStatus } from "../utils/canTransitionBookingStatus.js";

export const createBooking = async (req, res) => {
    try {
        const { service: serviceId, address, scheduledAt } = req.body;

        if(!serviceId || !address.trim() || !scheduledAt){
            return res.status(400).json({
                success: false,
                message: "Service, Adress and schedlued at are mandatory"
            });
        }

        // if (!duration || Number(duration) < 15) {
        //     return res.status(400).json({
        //       success: false,
        //       message: "Duration must be at least 15 minutes",
        //     });
        // }

        if (!mongoose.Types.ObjectId.isValid(serviceId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid service ID",
            });
        }

        const bookingDate = new Date(scheduledAt);

        if(Number.isNaN(bookingDate.getTime())){
            return res.status(400).json({
                success: false,
                message: "Invalid scheduled date",
            });
        }

        if(bookingDate <= new Date()){
            return res.status(400).json({
                success: false,
                message: "Booking date must be in the feature",
            });
        }

        const service = await Service.findOne({
            _id: serviceId,
            isActive: true
        })

        const bookingDuration = service.duration;

        const bookingEnd = new Date(
            bookingDate.getTime() +
              bookingDuration * 60 * 1000
        );

        if(!service){
            return res.status(404).json({
                success: false,
                message: "Service is not found or Inactive"
            })
        }

        const isBookingExisting = await Booking.findOne({
            provider: service.provider,
            scheduledAt: {
                $lt: bookingEnd
            },
            endAt: {
                $gt: bookingDate
            },
            status: {
                $in: ["pending", "in_progress", "accepted"]
            }
        })

        if(isBookingExisting){
            return res.status(409).json({
                success: false,
                message: "Provider is already booked for this time"
            })
        }

        const booking = await Booking.create({
            customer: req.user._id,
            service: service._id,
            provider: service.provider,
            price: service.price,
            scheduledAt: bookingDate,
            endAt: bookingEnd,
            duration: bookingDuration,
            address: address.trim(),
        });

        res.status(201).json({
            success: true,
            message: "Booking created!",
            booking
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${error}`
        })
    }
};

export const getBookings = async (req, res) => {
    try{

        const filter = {}

        if(req.user.role === "provider"){
            filter.provider = req.user.id
        }

        if(req.user.role === "customer"){
            filter.customer = req.user._id
        }

        const bookings = await Booking.find(filter)
        .populate("customer", "name email phone")
        .populate("service", "title category price")
        .populate("provider", "name email phone")
        .sort({ createdAt: -1 })

        if(!bookings){
            return res.status(404).json({
                success: false,
                message: `No bookings found`
            })
        }

        res.status(200).json({
            success: true,
            bookings
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${error}`
        })
    }
}

export const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
        .populate("customer", "name email phone")
        .populate("service", "title description category price")
        .populate("provider", "name email phone");

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        const userId = req.user._id.toString();

        const isCustomer =
        booking.customer._id.toString() === userId;

        const isProvider =
        booking.provider._id.toString() === userId;

        if (!isCustomer && !isProvider) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to view this booking",
            });
        }

        res.status(200).json({
            success: true,
            booking,
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${error}`
        });
    }
}

export const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if(!status){
            return res.status(400).json({
                success: false,
                message: "Status is missing"
            })
        }
        
        const availableStatusTransition = ["accepted", "in_progress", "completed"]

        if(!availableStatusTransition.includes(status)){
            return res.status(400).json({
                success: false,
                message: "Invalid status transition"
            })
        }

        const booking = await Booking.findById(req.params.id);

        if(!booking){
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            })
        }

        if(booking.provider._id.toString() !== req.user._id.toString()){
            return res.status(403).json({
                success: false,
                message: "Your are not authorised to update the status"
            })
        }

        if(!canTransitionBookingStatus(booking.status, status)){
            return res.status(404).json({
                success: false,
                message: `Can't change the booking status from ${booking.status} to ${status}`
            })
        }

        booking.status = status;

        await booking.save();

        res.status(200).json({
            success: true,
            message: "Status updated successfully!",
            booking
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${error}`
        });
    }
}

export const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if(!booking){
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        // Only customer can cancel their request 
        if(booking.customer._id.toString() !== req.user._id.toString()){
            return res.status(403).json({
                success: false,
                message: "Your are not authorised to update the status"
            });
        }

        if(booking.status !== "pending"){
            return res.status(400).json({
                success: false,
                message: `Booking cannot be cancelled when status is ${booking.status}`
            });
        }

        booking.status = "cancelled";

        await booking.save();

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully!",
            booking
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${error}`
        });
    }
}