"use client";

import { useMemo } from "react";
import Input from "@/components/ui/input";
import type { PassengerForm } from "@/store/flight-store";

type PassengerFormProps = {
  passengerForm: PassengerForm;
  onChange: (value: Partial<PassengerForm>) => void;
  errors: Partial<Record<keyof PassengerForm, string>>;
};

export default function PassengerForm({ passengerForm, onChange, errors }: PassengerFormProps) {
  const fields = useMemo(
    () => [
      { name: "fullName", label: "Full name", type: "text", placeholder: "Amina Patel" },
      { name: "passportNo", label: "Passport number", type: "text", placeholder: "A12345678" },
      { name: "nationality", label: "Nationality", type: "text", placeholder: "United States" },
      { name: "dob", label: "Date of birth", type: "date", placeholder: "DOB" }
    ] as const,
    []
  );

  return (
    <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Passenger information</h2>
        <p className="mt-2 text-sm text-slate-600">Enter one passenger’s details for this booking.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <Input
            key={field.name}
            label={field.label}
            type={field.type}
            placeholder={field.placeholder}
            value={passengerForm[field.name]}
            error={errors[field.name]}
            onChange={(event) => onChange({ [field.name]: event.target.value } as Partial<PassengerForm>)}
            required
          />
        ))}
      </div>
    </div>
  );
}
