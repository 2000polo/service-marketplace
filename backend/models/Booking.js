import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Provider is required"],
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: [true, "Service is required"],
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Customer is required"],
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: 0
    },
    scheduledAt: {
        type: Date,
        required: [true, "Service scheduled date is required"]
    },
    duration: {
        type: Number,
        required: [true, "Duration is required"],
        min: 15,
    },
    endAt: {
        type: Date,
        required: [true, "Service scheduled date is required"]
    },
    address: {
        type: String,
        trim: true,
        maxLength: 500,
        required: [true, "Address is required"]
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "in_progress", "completed", "cancelled"],
        default: "pending",
    },
});

bookingSchema.index({
    provider: 1,
    scheduledAt: 1,
    endAt: 1,
    status: 1,
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;