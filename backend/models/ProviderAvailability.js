import mongoose from 'mongoose';

const providerAvailabilitySchema = new mongoose.Schema({
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Provider is required"]
    },
    workingDays: {
        type: [Number],
        default: [1,2,3,4,5,6]
    },
    startTime: {
        type: String,
        required: [true, "Start time is required"],
        default: "9:00"
    },
    endTime: {
        type: String,
        required: [true, "End time is required"],
        default: "18:00"
    }
}, {
    timestamps: true,
});

const ProviderAvailability = mongoose.model("ProviderAvailability", providerAvailabilitySchema);

export default ProviderAvailability;