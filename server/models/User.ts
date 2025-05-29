import mongoose, { Document, Schema } from 'mongoose';

/* User schema model */

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'vendor' | 'delivery';
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['vendor', 'delivery'], required: true }
});

export default mongoose.model<IUser>('User', UserSchema);