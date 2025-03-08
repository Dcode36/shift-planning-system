import mongoose from 'mongoose';

const shiftSchema = new mongoose.Schema({
    assignedEmployee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    timeZone: { type: String, required: true },
}, { timestamps: true });

const Shift = mongoose.models.Shift || mongoose.model('Shift', shiftSchema);

export default Shift;
