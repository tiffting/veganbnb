"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MapInterface from "@/components/map/map-interface";

export default function MapPage() {
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
            <MapInterface className="flex-1 min-h-0" />
        </div>
    );
}