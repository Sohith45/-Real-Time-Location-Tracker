import mongoose, { Document, Schema } from 'mongoose';

/* Order schema model */

export interface IOrder extends Document {
  vendorId: string;
  customerName: string;
  status: string;
  deliveryPartnerId?: string;
  location: {
    lat: number;
    lng: number;
  };
}

const OrderSchema = new Schema<IOrder>({
  vendorId: { type: String, required: true },
  customerName: { type: String, required: true },
  status: { type: String, required: true },
  deliveryPartnerId: { type: String },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  }
});

export default mongoose.model<IOrder>('Order', OrderSchema);