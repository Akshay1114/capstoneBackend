// import User from "../models/NewUser.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
// const { OAuth2Client } = require("google-auth-library"); // Adjust path as per your project
import { OAuth2Client } from "google-auth-library";
import axios from "axios";
import qs from "qs";

export const signup = async (req, res) => {
  console.log("req.body user signup", req.body);
  let { name, email, password, role, familyCode, nickName,
    dueDate, } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    // Only generate a familyCode if it's not provided
    if (!familyCode) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

      const generateCode = () => {
        let result = '';
        for (let i = 0; i < 7; i++) {
          const randomIndex = Math.floor(Math.random() * chars.length);
          result += chars[randomIndex];
        }
        return result;
      };

      // Keep generating until it's unique in the DB
      let isUnique = false;
      while (!isUnique) {
        const code = generateCode();
        const existingCode = await User.findOne({ familyCode: code });
        if (!existingCode) {
          familyCode = code;
          isUnique = true;
        }
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ name, email, password: hashedPassword, role, familyCode, nickName, familyCode, dueDate });

    res.status(201).json({ message: "User created successfully", name, email, role, familyCode, dueDate, nickName });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }

};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, familyCode: user.familyCode, image: user.image },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const client = new OAuth2Client(
  "88587075672-l7tj82q29ipc4lspct2mtqucup3ko1rk.apps.googleusercontent.com"
);

export const googleLogin = async (req, res) => {
  const { id_token } = req.body;
  console.log("Google Login ID Token:", id_token);
  try {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: [
        "88587075672-l7tj82q29ipc4lspct2mtqucup3ko1rk.apps.googleusercontent.com", // web
        "88587075672-ahh9ek707daft1bukgpf69qaki33dp13.apps.googleusercontent.com", // iOS
        "88587075672-luumg658dj3akni6vucibec9j1c718hv.apps.googleusercontent.com", // Android
        "88587075672-l7tj82q29ipc4lspct2mtqucup3ko1rk.apps.googleusercontent.com", // Expo Go (same as web in this case)
      ],
    });

    const payload = ticket.getPayload();
    const { email, name, sub } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        name,
        googleId: sub,
        role: "self",
      });
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        familyCode: user.familyCode || null,
      },
    });
  } catch (err) {
    console.error("[Google Login Error]", err.message);
    return res.status(400).json({ message: "Google login failed: " + err.message });
  }
};