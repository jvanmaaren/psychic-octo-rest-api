import mongoose, { Schema, Document } from "mongoose";

export interface ISubscriber extends Document {
  name: string;
  subscribedToChannel: string;
  subscribeDate: Date;
}

const subscriberSchema: Schema<ISubscriber> = new Schema<ISubscriber>({
  name: {
    type: String,
    required: true,
  },
  subscribedToChannel: {
    type: String,
    required: true,
  },
  subscribeDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export default mongoose.model<ISubscriber>("Subscriber", subscriberSchema);
