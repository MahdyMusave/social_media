import mongoose, { Schema } from "mongoose";
const emailVerificationSchema = Schema({
  userId: String,
  token: String,
  createdAt: Date,
  expiresAt: Date,
});
const Verification = mongoose.model(
  "EmailVerification",
  emailVerificationSchema
);
export default Verification;
