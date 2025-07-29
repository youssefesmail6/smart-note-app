import { Types } from "mongoose";
import notesModel from "../models/notes.model";


export const noteResolvers = {
  Query: {
    getNotes: async (_: any, { filters }: any) => {
      const { userId, title, from, to, page = 1, limit = 10 } = filters || {};

      const query: any = {};
      if (userId) query.owner = new Types.ObjectId(userId);
      if (title) query.title = { $regex: title, $options: "i" };
      if (from || to) {
        query.createdAt = {};
        if (from) query.createdAt.$gte = new Date(from);
        if (to) query.createdAt.$lte = new Date(to);
      }

      const skip = (page - 1) * limit;
      const [notes, total] = await Promise.all([
        notesModel.find(query).populate("owner").skip(skip).limit(limit),
        notesModel.countDocuments(query),
      ]);

      return {
        notes,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      };
    },
  },
};