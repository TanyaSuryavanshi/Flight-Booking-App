import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FlightStatus, SeatClass } from "@/lib/types/db";

export type PassengerForm = {
  fullName: string;
  passportNo: string;
  nationality: string;
  dob: string;
};

export type FlightSearchQuery = {
  origin: string;
  destination: string;
  departureDate: string;
  passengers: number;
};

export type SelectedSeat = {
  seatId: string;
  seatNumber: string;
  seatClass: SeatClass;
  extraFee: number;
};

export type FlightSelection = {
  flightId: string;
  flightNo: string;
  origin: string;
  destination: string;
  departsAt: string;
  arrivesAt: string;
  aircraftType: string;
  status: FlightStatus;
  basePrice: number;
};

export type BookingStep = "search" | "details" | "seat" | "review" | "confirmation";

type FlightStoreState = {
  activeSearchQuery: FlightSearchQuery;
  selectedFlight: FlightSelection | null;
  selectedSeat: SelectedSeat | null;
  bookingStep: BookingStep;
  passengerForm: PassengerForm;
  setSearchQuery: (query: Partial<FlightSearchQuery>) => void;
  setSelectedFlight: (flight: FlightSelection | null) => void;
  setSelectedSeat: (seat: SelectedSeat | null) => void;
  setBookingStep: (step: BookingStep) => void;
  updatePassengerForm: (data: Partial<PassengerForm>) => void;
  resetBookingState: () => void;
};

const defaultSearchQuery: FlightSearchQuery = {
  origin: "",
  destination: "",
  departureDate: "",
  passengers: 1
};

const defaultPassengerForm: PassengerForm = {
  fullName: "",
  passportNo: "",
  nationality: "",
  dob: ""
};

export const useFlightStore = create<FlightStoreState>()(
  persist(
    (set) => ({
      activeSearchQuery: defaultSearchQuery,
      selectedFlight: null,
      selectedSeat: null,
      bookingStep: "search",
      passengerForm: defaultPassengerForm,
      setSearchQuery: (query) => set((state) => ({ activeSearchQuery: { ...state.activeSearchQuery, ...query } })),
      setSelectedFlight: (flight) => set({ selectedFlight: flight }),
      setSelectedSeat: (seat) => set({ selectedSeat: seat }),
      setBookingStep: (step) => set({ bookingStep: step }),
      updatePassengerForm: (data) => set((state) => ({ passengerForm: { ...state.passengerForm, ...data } })),
      resetBookingState: () =>
        set({
          activeSearchQuery: defaultSearchQuery,
          selectedFlight: null,
          selectedSeat: null,
          bookingStep: "search",
          passengerForm: defaultPassengerForm
        })
    }),
    {
      name: "flight-management-store",
      partialize: (state) => ({
        activeSearchQuery: state.activeSearchQuery,
        selectedFlight: state.selectedFlight,
        selectedSeat: state.selectedSeat,
        bookingStep: state.bookingStep,
        passengerForm: state.passengerForm
      })
    }
  )
);
