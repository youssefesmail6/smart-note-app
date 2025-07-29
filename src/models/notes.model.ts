import { Schema, model, Types, Document } from "mongoose";

export interface INote extends Document {
  title: string;
  content: string;
  owner: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default model<INote>("Note", noteSchema);
