import mongoose from 'mongoose';

import ProviderAvailability from "../models/ProviderAvailability.js";
import Service from "../models/Service.js";
import User from "../models/User.js";

export const createProviderAvailability = async (req, res) => {
    try {
        const { workingDays, startTime, endTime } = req.body;

        if(!Array.isArray(workingDays) || workingDays.length === 0){
            res.status(400).json({
                success: false,
                message: "Invalid working days"
            });
        }

        // Validate the working days value
        const invalidDays = workingDays.some(
            (day) => !Number.isInteger(day) || day < 0  || day > 6
        )

        if(invalidDays){
            return res.status(400).json({
                success: false,
                message: "Working days must contain values from 0 to 6",
            });
        }

        // Validate the time
        if(!startTime || !endTime){
            return res.status(400).json({
                success: false,
                message: "Start time and end time are required",
            });
        }

        if(startTime >= endTime){
            return res.status(400).json({
                success: false,
                message: "End time must be after start time",
            });
        }

        // check for dupliacte provider availability data
        const isDuplicateProviderAvailability = await ProviderAvailability.findOne({
            provider: req.user._id
        })

        if(isDuplicateProviderAvailability){
            return res.status(400).json({
                success: false,
                message: "Availability already exists for this provider",
            });
        }

        const availability = await ProviderAvailability.create(
            {
                provider: req.user._id,
                workingDays,
                startTime,
                endTime
            }
        )

        res.status(200).json({
            success: true,
            message: "Successfully created provider availability",
            availability
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Server error ${error}`,
        });
    }
}

export const getAvailability = async (req, res) => {
    try {
      const { providerId } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(providerId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid provider ID",
        });
      }
  
      const provider = await User.findOne({
        _id: providerId,
        role: "provider",
      });
  
      if (!provider) {
        return res.status(404).json({
          success: false,
          message: "Provider not found",
        });
      }
  
      const availability = await ProviderAvailability.findOne({
        provider: provider._id,
      });
  
      if (!availability) {
        return res.status(404).json({
          success: false,
          message: "Provider availability not configured",
        });
      }
  
      res.status(200).json({
        success: true,
        availability,
      });
    } catch (error) {
      console.error("Get availability error:", error);
  
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
};

export const getAvailableSlots = async (req, res) => {
    try {
      const { providerId } = req.params;
      const { date, serviceId } = req.query;
  
      // Validate provider ID
      if (!mongoose.Types.ObjectId.isValid(providerId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid provider ID",
        });
      }
  
      // Validate service ID
      if (!serviceId) {
        return res.status(400).json({
          success: false,
          message: "Service ID is required",
        });
      }
  
      if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid service ID",
        });
      }
  
      // Validate date
      if (!date) {
        return res.status(400).json({
          success: false,
          message: "Date is required",
        });
      }
  
      const selectedDate = new Date(`${date}T00:00:00.000Z`);
  
      if (Number.isNaN(selectedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid date",
        });
      }
  
      // Check provider
      const provider = await User.findOne({
        _id: providerId,
        role: "provider",
      });
  
      if (!provider) {
        return res.status(404).json({
          success: false,
          message: "Provider not found",
        });
      }
  
      // Get provider availability
      const availability =
        await ProviderAvailability.findOne({
          provider: providerId,
        });
  
      if (!availability) {
        return res.status(404).json({
          success: false,
          message: "Provider availability not configured",
        });
      }
  
      // Get service
      const service = await Service.findOne({
        _id: serviceId,
        provider: providerId,
        isActive: true,
      });
  
      if (!service) {
        return res.status(404).json({
          success: false,
          message: "Service not found or inactive",
        });
      }
  
      // Check whether provider works on this day
      const dayOfWeek = selectedDate.getUTCDay();
  
      if (!availability.workingDays.includes(dayOfWeek)) {
        return res.status(200).json({
          success: true,
          date,
          slots: [],
          message: "Provider is not available on this day",
        });
      }
  
      // Temporary response
      res.status(200).json({
        success: true,
        date,
        serviceDuration: service.duration,
        workingHours: {
          startTime: availability.startTime,
          endTime: availability.endTime,
        },
        slots: [],
      });
    } catch (error) {
      console.error("Get available slots error:", error);
  
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
};