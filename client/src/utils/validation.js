import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
  role: z.enum(["TENANT", "OWNER"], {
    errorMap: () => ({ message: "Please select a role" }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const profileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
  profilePic: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const pgSchema = z.object({
  name: z.string().min(3, "PG name must be at least 3 characters"),
  address: z.string().min(5, "Full address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Pincode must be exactly 6 digits"),
  landmark: z.string().optional(),
  latitude: z.preprocess((val) => val === "" ? undefined : val, z.coerce.number({ invalid_type_error: "Latitude must be a number" })),
  longitude: z.preprocess((val) => val === "" ? undefined : val, z.coerce.number({ invalid_type_error: "Longitude must be a number" })),
  description: z.string().min(10, "Description must be at least 10 characters"),
  totalRooms: z.preprocess((val) => val === "" ? undefined : val, z.coerce.number().int().min(0, "Cannot be negative")),
  availableRooms: z.preprocess((val) => val === "" ? undefined : val, z.coerce.number().int().min(0, "Cannot be negative")),
  pricePerBed: z.preprocess((val) => val === "" ? undefined : val, z.coerce.number().min(0, "Cannot be negative")),
  depositAmount: z.preprocess((val) => val === "" ? undefined : val, z.coerce.number().min(0, "Cannot be negative")),
  foodIncluded: z.boolean().default(false),
  acAvailable: z.boolean().default(false),
  wifiAvailable: z.boolean().default(false),
  laundryAvailable: z.boolean().default(false),
  pgType: z.string().min(1, "Please select a PG type").refine(
    (val) => ["MALE_ONLY", "FEMALE_ONLY", "UNISEX"].includes(val),
    { message: "Invalid PG type selection" }
  ),
  rating: z.string().or(z.number()).optional().transform((val) => val ? parseFloat(val.toString()) : 0).refine((n) => n >= 0 && n <= 5, "Rating must be between 0 and 5"),
  verified: z.boolean().default(false),
  ownerId: z.coerce.string().optional(),
  images: z.array(z.string()).optional().default([]),
});
export const loginSchema = z.object({
  identifier: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});
