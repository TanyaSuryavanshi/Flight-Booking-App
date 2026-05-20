"use client";

import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";
import { useFlightStore } from "@/store/flight-store";
import { useUserStore } from "@/store/user-store";
import Button from "@/components/ui/button";

export default function SignOutButton() {
  const router = useRouter();
  const clearUserStore = useUserStore((state) => state.clearUserStore);
  const resetBookingState = useFlightStore((state) => state.resetBookingState);

  const handleSignOut = async () => {
    await supabaseClient.auth.signOut();
    clearUserStore();
    resetBookingState();
    router.push("/");
  };

  return (
    <Button variant="ghost" onClick={handleSignOut}>
      Sign out
    </Button>
  );
}
