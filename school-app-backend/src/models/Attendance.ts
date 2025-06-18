import mongoose, { Document, Schema } from 'mongoose';

export interface IAttendance extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  status: 'present' | 'absent' | 'saturday' | 'holiday';
  subject?: string;
}

const attendanceSchema = new Schema<IAttendance>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['present', 'absent', 'saturday', 'holiday'],
    required: true 
  },
  subject: { type: String }
}, { timestamps: true });

export default mongoose.model<IAttendance>('Attendance', attendanceSchema);
