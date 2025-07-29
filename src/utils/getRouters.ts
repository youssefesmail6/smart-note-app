import { Router } from "express";
import userRoutes from "../routes/user.routes";
import authRoutes from "../routes/auth.routes";


export const getRouters = async (): Promise<Router[]> => {
  return [userRoutes, authRoutes];
};