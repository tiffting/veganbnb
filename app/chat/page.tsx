"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatInterface from "@/components/chat/chat-interface";

export default function ChatPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem("navegate-user-preferences");
    
    if (!hasCompletedOnboarding) {
      // Redirect to onboarding if no preferences found
      router.push("/onboarding");
    }
  }, [router]);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <ChatInterface className="flex-1 min-h-0" />
    </div>
  );
}