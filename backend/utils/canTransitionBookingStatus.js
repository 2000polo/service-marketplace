const bookingStatusTransitions = {
    "pending": ["accepted"],
    "accepted": ["in_progress"],
    "in_progress": ["completed"],
    "completed": [],
    "cancelled": []
}

export const canTransitionBookingStatus = (currentStatus, newStatus) => {
    return bookingStatusTransitions[currentStatus]?.includes(newStatus)
}