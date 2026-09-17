import Booking from "../models/Booking.js";
import Service from "../models/Service.js";

export const createBooking = async (req, res) => {
    try {
        const { service: serviceId, address, scheduledAt } = req.body;

        if(!serviceId || !address || !scheduledAt){
            return res.status(400).json({
                success: false,
                message: "Service, Adress and schedlued at are mandatory"
            });
        }

        const service = await Service.findOne({
            _id: serviceId,
            isActive: true
        })

        if(!service){
            return res.status(404).json({
                success: false,
                message: "Service is not found or Inactive"
            })
        }

        const booking = await Booking.create({
            provider: service.provider,
            service: service._id,
            customer: req.user._id,
            price: service.price,
            address,
            scheduledAt
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
        })
    }
}