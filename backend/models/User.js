import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    svvNetId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { collection: "users" } // Ensure collection name is 'users'
);

// ✅ Use `export default` for ES Modules
const User = mongoose.model("User", UserSchema);
export default User;
