
import cron from "node-cron";
import Booking from "../models/Booking.js";

const startBookingExpirationJob = () => {
  // Run every minute
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      const result = await Booking.updateMany(
        {
          status: "pending",
          scheduledAt: { $lte: now },
        },
        {
          $set: { status: "expired" },
        }
      );

      if (result.modifiedCount > 0) {
        console.log(
          `${result.modifiedCount} booking(s) expired automatically`
        );
      }
    } catch (error) {
      console.error("Booking expiration job failed:", error);
    }
  });

  console.log("Booking expiration job started");
};

export default startBookingExpirationJob;
