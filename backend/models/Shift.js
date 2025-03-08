import mongoose from 'mongoose';

const shiftSchema = new mongoose.Schema({
    assignedEmployee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    shiftTime: { type: Date, required: true },
    duration: { type: Number, required: true },
    timeZone: { type: String, required: true },
}, { timestamps: true });

const Shift = mongoose.models.Shift || mongoose.model('Shift', shiftSchema);

export default Shift;
