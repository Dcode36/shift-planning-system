import mongoose from 'mongoose';

const AvailabilitySchema = new mongoose.Schema(
    {
        employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        timeZone: { type: String, required: true },
        availability: [
            {
                date: { type: String, required: true },
                startTime: { type: String, required: true },
                endTime: { type: String, required: true },
            }
        ]
    },
    { timestamps: true }
);

const Availability = mongoose.models.Availability || mongoose.model('Availability', AvailabilitySchema);

export default Availability;
