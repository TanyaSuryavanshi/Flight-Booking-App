import { z } from "zod";

export const passengerSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  passportNo: z.string().min(5, "Passport number is required."),
  nationality: z.string().min(2, "Nationality is required."),
  dob: z.string().refine((value) => Boolean(Date.parse(value)), "Enter a valid date of birth.")
});

export type PassengerFormValues = z.infer<typeof passengerSchema>;
