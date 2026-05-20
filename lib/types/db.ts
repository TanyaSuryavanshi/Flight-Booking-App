export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type FlightStatus = "on-time" | "delayed" | "cancelled" | "boarding";
export type SeatClass = "economy" | "business" | "first";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "rescheduled";

export interface Database {
  public: {
    Tables: {
      flights: {
        Row: {
          id: string;
          flight_no: string;
          origin: string;
          destination: string;
          departs_at: string;
          arrives_at: string;
          aircraft_type: string;
          status: FlightStatus;
          base_price: number;
        };
        Insert: {
          id?: string;
          flight_no: string;
          origin: string;
          destination: string;
          departs_at: string;
          arrives_at: string;
          aircraft_type: string;
          status?: FlightStatus;
          base_price: number;
        };
        Update: {
          id?: string;
          flight_no?: string;
          origin?: string;
          destination?: string;
          departs_at?: string;
          arrives_at?: string;
          aircraft_type?: string;
          status?: FlightStatus;
          base_price?: number;
        };
      };
      seats: {
        Row: {
          id: string;
          flight_id: string;
          seat_number: string;
          class: SeatClass;
          is_available: boolean;
          extra_fee: number;
        };
        Insert: {
          id?: string;
          flight_id: string;
          seat_number: string;
          class: SeatClass;
          is_available?: boolean;
          extra_fee: number;
        };
        Update: {
          id?: string;
          flight_id?: string;
          seat_number?: string;
          class?: SeatClass;
          is_available?: boolean;
          extra_fee?: number;
        };
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          flight_id: string;
          seat_id: string;
          status: BookingStatus;
          booked_at: string;
          total_price: number;
          pnr_code: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          flight_id: string;
          seat_id: string;
          status?: BookingStatus;
          booked_at?: string;
          total_price: number;
          pnr_code: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          flight_id?: string;
          seat_id?: string;
          status?: BookingStatus;
          booked_at?: string;
          total_price?: number;
          pnr_code?: string;
        };
      };
      passengers: {
        Row: {
          id: string;
          booking_id: string;
          full_name: string;
          passport_no: string;
          nationality: string;
          dob: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          full_name: string;
          passport_no: string;
          nationality: string;
          dob: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          full_name?: string;
          passport_no?: string;
          nationality?: string;
          dob?: string;
        };
      };
      reschedules: {
        Row: {
          id: string;
          booking_id: string;
          old_flight_id: string;
          new_flight_id: string;
          requested_at: string;
          fee_charged: number;
        };
        Insert: {
          id?: string;
          booking_id: string;
          old_flight_id: string;
          new_flight_id: string;
          requested_at?: string;
          fee_charged: number;
        };
        Update: {
          id?: string;
          booking_id?: string;
          old_flight_id?: string;
          new_flight_id?: string;
          requested_at?: string;
          fee_charged?: number;
        };
      };
    };
    Views: {};
    Functions: {
      reserve_seat: {
        Args: {
          flight_uuid: string;
          seat_uuid: string;
        };
        Returns: Database["public"]["Tables"]["seats"]["Row"];
      };
      release_seat: {
        Args: {
          booking_uuid: string;
        };
        Returns: Database["public"]["Tables"]["seats"]["Row"];
      };
      create_booking: {
        Args: {
          user_uuid: string;
          flight_uuid: string;
          seat_uuid: string;
          passenger_full_name: string;
          passenger_passport_no: string;
          passenger_nationality: string;
          passenger_dob: string;
          total: number;
          pnr: string;
        };
        Returns: Database["public"]["Tables"]["bookings"]["Row"];
      };
      cancel_booking: {
        Args: {
          booking_uuid: string;
        };
        Returns: Database["public"]["Tables"]["bookings"]["Row"];
      };
      reschedule_booking: {
        Args: {
          booking_uuid: string;
          new_flight_uuid: string;
          new_seat_uuid: string;
          fee_charged: number;
        };
        Returns: Database["public"]["Tables"]["bookings"]["Row"];
      };
    };
    Enums: {};
  };
}
