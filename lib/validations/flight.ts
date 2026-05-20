import { z } from "zod";

export const flightSearchSchema = z.object({
  origin: z.string().min(2, "Enter a valid origin code"),
  destination: z.string().min(2, "Enter a valid destination code"),
  departureDate: z.string().regex(/\d{4}-\d{2}-\d{2}/, "Use a valid departure date"),
  passengers: z.coerce.number().min(1).max(9)
});

export type FlightSearchFormValues = z.infer<typeof flightSearchSchema>;
