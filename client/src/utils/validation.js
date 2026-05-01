import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string()
    .min(1, "Phone number is required")
    .refine((val) => /^[0-9]*$/.test(val), "Only digits are allowed in phone number")
    .refine((val) => val.length === 10, "Phone number must be exactly 10 digits"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
  role: z.enum(["TENANT", "OWNER"], {
    errorMap: () => ({ message: "Please select a role" }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const profileSchema = z.object({
  displayName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
  profilePic: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const pgSchema = z.object({
  pgName: z.string()
    .min(1, "PG name is required")
    .regex(/^(?=(?:.*[A-Za-z]){10,}).*$/, "PG name must contain at least 10 alphabets")
    .regex(/^[A-Za-z0-9 ]+$/, "PG name must not contain special characters"),
  pgType: z.string().min(1, "PG type is required"),
  description: z.string()
    .min(1, "Description is required")
    .regex(/^(?=(?:.*[A-Za-z]){50,}).*$/, "Description must contain at least 50 alphabets")
    .refine((val) => !/^[0-9\s]+$/.test(val), "Description cannot be only numbers"),
  rating: z.coerce.number().min(0, "Rating must be between 0 and 5").max(5, "Rating must be between 0 and 5").default(0),
  address: z.string()
    .min(1, "Address is required")
    .regex(/^(?=.*[A-Za-z]).*$/, "Address must contain at least one alphabet")
    .refine((val) => !/^[0-9\s]+$/.test(val), "Address cannot be only numbers"),
  city: z.string().min(1, "City is required").regex(/^[A-Za-z ]+$/, "City must contain only alphabets"),
  state: z.string().min(1, "State is required").regex(/^[A-Za-z ]+$/, "State must contain only alphabets"),
  pincode: z.string().min(1, "Pincode is required").regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
  landmark: z.string()
    .min(1, "Landmark is required")
    .regex(/^(?=(?:.*[A-Za-z]){10,}).*$/, "Landmark must contain at least 10 alphabets")
    .refine((val) => !/^[0-9\s]+$/.test(val), "Landmark cannot be only numbers"),
  latitude: z.coerce.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90"),
  longitude: z.coerce.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180"),
  totalRooms: z.coerce.number().int().min(1, "Total capacity must be greater than 0"),
  availableRooms: z.coerce.number().int().min(0, "Vacancy cannot be negative"),
  pricePerBed: z.coerce.number().min(0.01, "Price must be greater than 0"),
  depositAmount: z.coerce.number().min(0, "Security deposit cannot be negative"),
  foodIncluded: z.boolean().default(false),
  acAvailable: z.boolean().default(false),
  wifiAvailable: z.boolean().default(false),
  laundryAvailable: z.boolean().default(false),
  verified: z.boolean().default(false),
  ownerId: z.coerce.string().optional(),
  images: z.array(z.string()).optional().default([]),
}).refine((data) => data.availableRooms <= data.totalRooms, {
  message: "Vacancy cannot exceed total capacity",
  path: ["availableRooms"],
});

export const loginSchema = z.object({
  identifier: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});
<<<<<<< Updated upstream
=======

export const forgotPasswordSchema = z.object({
  identifier: z.string().min(1, "Username or email is required"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const pgRegistrationSchema = z.object({
  pgName: z.string()
    .min(1, "PG name is required")
    .refine(val => (val.match(/[A-Za-z]/g) || []).length >= 10, 
      "PG name must contain at least 10 alphabets")
    .refine(val => !/^\d+$/.test(val), 
      "PG name cannot be only numbers"),

  pgType: z.string()
    .min(1, "PG type is required"),

  description: z.string()
    .min(1, "Description is required")
    .refine(val => !/^\d+$/.test(val), 
      "Description cannot be only numbers")
    .refine(val => (val.match(/[A-Za-z]/g) || []).length >= 50, 
      "Description must contain at least 50 alphabets"),

  rating: z.coerce.number()
    .min(0, "Rating must be between 0 and 5")
    .max(5, "Rating must be between 0 and 5"),

  fullAddress: z.string()
    .min(1, "Address is required")
    .refine(val => /[A-Za-z]/.test(val), 
      "Address must contain at least one alphabet")
    .refine(val => !/^\d+$/.test(val), 
      "Address cannot be only numbers")
    .refine(val => /^[A-Za-z0-9 ,./#-]+$/.test(val), 
      "Address contains invalid characters")
    .refine(val => {
      const words = val.trim().split(/\s+/).length;
      const alphabets = (val.match(/[A-Za-z]/g) || []).length;
      return words >= 2 || alphabets >= 4;
    }, "Address must contain at least two words or four alphabets"),

  city: z.string()
    .min(1, "City is required")
    .regex(/^[A-Za-z ]+$/, "City must contain only alphabets"),

  state: z.string()
    .min(1, "State is required")
    .regex(/^[A-Za-z ]+$/, "State must contain only alphabets"),

  pincode: z.string()
    .min(6, "Pincode must be exactly 6 digits")
    .max(6, "Pincode must be exactly 6 digits")
    .regex(/^\d+$/, "Pincode must contain only numbers"),

  landmark: z.string()
    .min(1, "Landmark is required")
    .refine(val => !/^\d+$/.test(val), 
      "Landmark cannot be only numbers")
    .refine(val => (val.match(/[A-Za-z]/g) || []).length >= 10, 
      "Landmark must contain at least 10 alphabets"),

  latitude: z.coerce.number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),

  longitude: z.coerce.number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),

  totalCapacity: z.coerce.number()
    .min(1, "Total capacity must be greater than 0"),

  currentVacancy: z.coerce.number()
    .min(0, "Vacancy cannot be negative"),

  pricePerBed: z.coerce.number()
    .min(1, "Price must be greater than 0"),

  securityDeposit: z.coerce.number()
    .min(0, "Security deposit cannot be negative")

}).refine(data => data.currentVacancy <= data.totalCapacity, {
  message: "Vacancy cannot exceed total capacity",
  path: ["currentVacancy"]
});
>>>>>>> Stashed changes
