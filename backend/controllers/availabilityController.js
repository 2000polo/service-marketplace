import mongoose from "mongoose";

import ProviderAvailability from "../models/ProviderAvailability.js";
import Service from "../models/Service.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";

const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
};

const isValidTime = (time) => {
    if (!/^\d{2}:\d{2}$/.test(time)) {
      return false;
    }
  
    const minutes = timeToMinutes(time);
  
    return minutes >= 0 && minutes <= 1439;
  };

export const createProviderAvailability = async (req, res) => {
  try {
    const { workingDays, startTime, endTime } = req.body;

    if (!Array.isArray(workingDays) || workingDays.length === 0) {
      res.status(400).json({
        success: false,
        message: "Invalid working days",
      });
    }

    // Validate the working days value
    const invalidDays = workingDays.some(
      (day) => !Number.isInteger(day) || day < 0 || day > 6,
    );

    if (invalidDays) {
      return res.status(400).json({
        success: false,
        message: "Working days must contain values from 0 to 6",
      });
    }

    // Validate the time
    if (!startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Start time and end time are required",
      });
    }

    if (!isValidTime(startTime) || !isValidTime(endTime)) {
        return res.status(400).json({
            success: false,
            message: "Time must be in HH:mm format",
        });
    }
      
    if (
        timeToMinutes(startTime) >=
        timeToMinutes(endTime)
    ) {
        return res.status(400).json({
            success: false,
            message: "End time must be after start time",
        });
    }

    // check for dupliacte provider availability data
    const isDuplicateProviderAvailability = await ProviderAvailability.findOne({
      provider: req.user._id,
    });

    if (isDuplicateProviderAvailability) {
      return res.status(400).json({
        success: false,
        message: "Availability already exists for this provider",
      });
    }

    const availability = await ProviderAvailability.create({
      provider: req.user._id,
      workingDays,
      startTime,
      endTime,
    });

    res.status(200).json({
      success: true,
      message: "Successfully created provider availability",
      availability,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Server error ${error}`,
    });
  }
};

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
        
        if(selectedDate.getDate() < new Date().getDate()){
          return res.status(400).json({
              success: false,
              message: "Booking date must be in the feature",
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
        const availability = await ProviderAvailability.findOne({
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

        const startMinutes = timeToMinutes(availability.startTime);
        const endMinutes = timeToMinutes(availability.endTime);
        const serviceDuration = service.duration;

        if (serviceDuration > endMinutes - startMinutes) {
            return res.status(200).json({
                success: true,
                date,
                serviceDuration,
                workingHours: {
                    startTime: availability.startTime,
                    endTime: availability.endTime,
                },
                slots: [],
                message: "Service duration is longer than provider working hours",
            });
        }

        const slots = [];

        for (
            let currentMinutes = startMinutes;
            currentMinutes + serviceDuration <= endMinutes;
            currentMinutes += serviceDuration
        ) {
            const hours = Math.floor(currentMinutes / 60);
            const minutes = currentMinutes % 60;

            const endSlotMinutes = currentMinutes + serviceDuration;

            const endHours = Math.floor(endSlotMinutes / 60);
            const endMinutesValue = endSlotMinutes % 60;

            const formatTime = (hours, minutes) =>
                `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

            slots.push({
                startTime: formatTime(hours, minutes),
                endTime: formatTime(endHours, endMinutesValue),
            });
        }

        // retrieving the existing bookings
        const dayStart = new Date(`${date}T00:00:00.000Z`);
        const dayEnd = new Date(`${date}T23:59:59.999Z`);

        const existingBookings = await Booking.find({
            provider: providerId,

            status: {
                $in: ["pending", "accepted", "in_progress"],
            },

            scheduledAt: {
                $lt: dayEnd,
            },

            endAt: {
                $gt: dayStart,
            },
        });

        console.log("existingBookings", existingBookings)

        // /deriving the booking ranges
        const bookingRanges = existingBookings.map(
            (booking) => {
              const start = new Date(booking.scheduledAt);
              const end = new Date(booking.endAt);
          
              return {
                start: start.getUTCHours() * 60 + start.getUTCMinutes(),
                end: end.getUTCHours() * 60 + end.getUTCMinutes(),
              };
            }
        );

        const availableSlots = slots.filter((slot) => {
            const slotStart = timeToMinutes(slot.startTime);
            const slotEnd = timeToMinutes(slot.endTime);
          
            const hasOverlap = bookingRanges.some(
                (booking) => {
                    const overlap =
                    slotStart < booking.end &&
                    slotEnd > booking.start;
            
                    console.log({
                        slot,
                        booking,
                        overlap,
                        slotStart,
                        slotEnd
                    });
            
                    return overlap;
                }
            );
          
            return !hasOverlap;
        });

        console.log("availableSlots", availableSlots)

        // Removing past time if the booking date is today
        const now = new Date();
        const isToday = date === now.toISOString().split("T")[0];

        console.log('isToday', isToday)

        let finalSlots = availableSlots;

        if (isToday) {
            const currentMinutes =
                now.getHours() * 60 +
                now.getMinutes();

            finalSlots = availableSlots.filter((slot) => {
                    const slotStart = timeToMinutes(
                        slot.startTime
                    );

                return slotStart > currentMinutes;
            });

            console.log("final slots", finalSlots)
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
            slots: finalSlots,
        });
    } catch (error) {
        console.error("Get available slots error:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export const updateAvailability = async (req, res) => {
    try {
        const { workingDays, startTime, endTime } = req.body;
  
        if ( !Array.isArray(workingDays) || workingDays.length === 0 ) {
            return res.status(400).json({
                success: false,
                message: "Working days are required",
            });
        }
  
        const invalidDay = workingDays.some(
            (day) => !Number.isInteger(day) || day < 0 || day > 6
        );
  
        if (invalidDay) {
            return res.status(400).json({
                success: false,
                message: "Working days must contain values from 0 to 6",
            });
        }
  
        if (!startTime || !endTime) {
            return res.status(400).json({
                success: false,
                message: "Start time and end time are required",
            });
        }
  
        if (!isValidTime(startTime) || !isValidTime(endTime)) {
            return res.status(400).json({
                success: false,
                message: "Time must be in HH:mm format",
            });
        }
      
        if (timeToMinutes(startTime) >= timeToMinutes(endTime)) {
            return res.status(400).json({
                success: false,
                message: "End time must be after start time",
            });
        }
  
        const availability = await ProviderAvailability.findOne({
            provider: req.user._id,
        });
    
        if (!availability) {
            return res.status(404).json({
                success: false,
                message: "Availability not configured",
            });
        }
  
      availability.workingDays = workingDays;
      availability.startTime = startTime;
      availability.endTime = endTime;
  
      await availability.save();
  
      res.status(200).json({
        success: true,
        message: "Availability updated successfully",
        availability,
      });
    } catch (error) {
      console.error("Update availability error:", error);
  
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
};


