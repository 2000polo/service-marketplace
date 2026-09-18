const bookingStatusTransitions = {
    "pending": ["accepted"],
    "accepted": ["inprogress"],
    "in_progress": ["completed"],
    "completed": [],
    "cancelled": []
}

export const canTransitionBookingStatus = (currentStatus, newStatus) => {
    return bookingStatusTransitions[currentStatus]?.includes(newStatus)
}