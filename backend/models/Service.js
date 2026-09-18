import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Provider is required"],
    },

    title: {
      type: String,
      required: [true, "Service title is required"],
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    description: {
      type: String,
      required: [true, "Service description is required"],
      trim: true,
      maxlength: 1000,
    },

    category: {
      type: String,
      required: [true, "Service category is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Service price is required"],
      min: 0,
    },
    duration: {
      type: Number,
      required: [true, "Service duration is required"],
      min: 15,
    },
    location: {
      city: {
        type: String,
        required: true,
        trim: true,
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model("Service", serviceSchema);

export default Service;