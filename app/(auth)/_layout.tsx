import { useAuth } from "@/contexts/AuthContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
