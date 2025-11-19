"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import TravelSettings, { type TravelSettings as TravelSettingsType } from "@/components/settings/travel-settings";
import { mockListings } from "@/lib/mock-data";
import VenueCard from "./venue-card";

interface MapInterfaceProps {
    className?: string;
}

interface Listing {
    id: string;
    category: string;
    name: string;
    description: string;
    location: {
        coordinates: { lat: number; lng: number };
        address: string;
        city?: string;
        country?: string;
    };
    safetyScore: {
        score: number;
        reasoning?: string;
        signals?: {
            [key: string]: number | undefined;
        };
        citations?: string[];
    };
    logistics: {
        pricing?: {
            range?: string;
            average_meal?: string;
            note?: string;
        };
        hours?: {
            [key: string]: string;
        };
        booking?: {
            required: boolean;
            methods?: Array<{
                type: string;
                url?: string;
                contact?: string;
                note?: string;
            }>;
            advance_notice?: string;
        };
        accessibility?: {
            wheelchair?: boolean;
            dietary_accommodations?: string[];
        };
    };
    website?: string;
    reviews?: string[];
}

export default function MapInterface({ className }: MapInterfaceProps) {
    // Initialize settings from localStorage
    const [userSettings, setUserSettings] = useState<TravelSettingsType | null>(() => {
        try {
            const savedSettings = localStorage.getItem("navegate-user-preferences");
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                console.log("Loaded existing settings from localStorage:", settings);
                return settings;
            }
        } catch (error) {
            console.error("Failed to load user settings:", error);
        }
        return null;
    });
    
    const [selectedVenue, setSelectedVenue] = useState<Listing | null>(null);
    
    // Calculate filtered listings based on settings
    const filteredListings = (() => {
        let filtered = mockListings;

        if (userSettings) {
            // Budget filter
            if (userSettings.budgetRange !== "any") {
                filtered = filtered.filter(listing => 
                    listing.logistics?.pricing?.range === userSettings.budgetRange
                );
            }

            // Safety score filter
            filtered = filtered.filter(listing => 
                listing.safetyScore.score >= userSettings.minSafetyScore
            );

            // Currently open filter (simplified for demo)
            if (userSettings.openNow) {
                // For demo purposes, show all venues as potentially open
            }

            // Wheelchair accessibility filter
            if (userSettings.mobilityPreferences.wheelchairAccessible) {
                filtered = filtered.filter(listing => 
                    listing.logistics?.accessibility?.wheelchair === true
                );
            }
        }

        return filtered as Listing[];
    })();

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "restaurant":
            case "cafe":
            case "ice_cream":
            case "bar":
                return "🍽️";
            case "accommodation":
                return "🏨";
            case "tour":
                return "🗺️";
            case "event":
                return "🎉";
            default:
                return "📍";
        }
    };

    const getSafetyColor = (score: number) => {
        if (score >= 80) return "bg-green-500";
        if (score >= 60) return "bg-yellow-500";
        return "bg-red-500";
    };

    const handleVenueClick = (listing: Listing) => {
        setSelectedVenue(listing);
    };

    return (
        <div className={`flex flex-col h-full ${className}`}>
            {/* Header */}
            <div className="border-b bg-white px-3 py-2 sm:p-4 relative z-20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <Avatar className="w-7 h-7 sm:w-8 sm:h-8">
                            <AvatarFallback className="bg-orange-500 text-white">
                                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                            <h2 className="font-semibold text-sm sm:text-lg truncate">Explore Berlin</h2>
                            <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Discover vegan venues around you</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Unified Travel Settings */}
                        <TravelSettings 
                            onSettingsChange={setUserSettings}
                            filteredCount={filteredListings.length}
                            showFilterResults={true}
                        />
                    </div>
                </div>
            </div>

            {/* Active Settings Banner */}
            {userSettings && (userSettings.budgetRange !== "any" || userSettings.minSafetyScore > 70 || userSettings.openNow || userSettings.mobilityPreferences.wheelchairAccessible) && (
                <div className="bg-green-50 border-b border-green-200 px-3 py-2 sm:px-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm gap-1 sm:gap-0">
                        <span className="text-green-800">
                            <strong>Active filters:</strong>{" "}
                            {(() => {
                                const filters = [];
                                
                                if (userSettings.budgetRange !== "any") {
                                    filters.push(`${userSettings.budgetRange} budget`);
                                }
                                
                                if (userSettings.minSafetyScore > 70) {
                                    filters.push(`${userSettings.minSafetyScore}+ safety`);
                                }
                                
                                if (userSettings.mobilityPreferences.wheelchairAccessible) {
                                    filters.push('wheelchair accessible');
                                }
                                
                                if (userSettings.openNow) {
                                    filters.push('open now');
                                }
                                
                                return filters.length > 0 ? filters.join(' • ') : 'Default settings';
                            })()}
                        </span>
                        <span className="text-green-600 text-xs hidden sm:block">
                            {filteredListings.length} venues match your preferences
                        </span>
                    </div>
                </div>
            )}

            {/* Map Container */}
            <div className="flex-1 relative">
                {/* Simple Demo Map */}
                <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 relative overflow-hidden">
                    {/* Demo Map Background */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="w-full h-full bg-gray-200 relative">
                            {/* Berlin-style street grid pattern */}
                            <div className="absolute inset-0">
                                {[...Array(10)].map((_, i) => (
                                    <div key={`h-${i}`} 
                                        className="absolute w-full h-px bg-gray-400" 
                                        style={{ top: `${10 + i * 8}%` }}
                                    />
                                ))}
                                {[...Array(8)].map((_, i) => (
                                    <div key={`v-${i}`} 
                                        className="absolute h-full w-px bg-gray-400" 
                                        style={{ left: `${15 + i * 10}%` }}
                                    />
                                ))}
                            </div>
                            
                            {/* Spree River representation */}
                            <div 
                                className="absolute bg-blue-300 rounded-full transform rotate-12"
                                style={{
                                    width: "60%",
                                    height: "4px",
                                    top: "40%",
                                    left: "20%"
                                }}
                            />
                        </div>
                    </div>

                    {/* Venue Markers */}
                    {filteredListings.map((listing, index) => {
                        // Create spread-out positions based on coordinates
                        const x = 20 + (index % 6) * 12 + Math.sin(index) * 5;
                        const y = 25 + Math.floor(index / 6) * 15 + Math.cos(index) * 8;
                        
                        return (
                            <button
                                key={listing.id}
                                onClick={() => handleVenueClick(listing)}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                                style={{
                                    left: `${Math.max(10, Math.min(90, x))}%`,
                                    top: `${Math.max(15, Math.min(85, y))}%`
                                }}
                            >
                                {/* Marker */}
                                <div className="relative">
                                    <div className={`w-8 h-8 sm:w-10 sm:h-10 ${getSafetyColor(listing.safetyScore.score)} rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-medium shadow-lg group-hover:scale-110 transition-transform border-2 border-white`}>
                                        {listing.safetyScore.score}
                                    </div>
                                    
                                    {/* Category Icon */}
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full flex items-center justify-center text-xs border shadow-sm">
                                        {getCategoryIcon(listing.category)}
                                    </div>

                                    {/* Venue Name Tooltip (Desktop) */}
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
                                        <div className="bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap max-w-32 truncate">
                                            {listing.name}
                                        </div>
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                                    </div>
                                </div>
                            </button>
                        );
                    })}

                    {/* Current Location Indicator */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
                        <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-25"></div>
                    </div>
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 text-xs">
                    <div className="font-medium mb-2">Safety Scores</div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span>80+ Excellent</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span>60+ Good</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span>&lt;60 Caution</span>
                        </div>
                    </div>
                </div>

                {/* Venue Count */}
                <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2 text-sm">
                    <span className="font-medium">{filteredListings.length}</span> venues
                </div>
            </div>

            {/* Venue Details Card */}
            {selectedVenue && (
                <VenueCard
                    venue={selectedVenue}
                    onClose={() => setSelectedVenue(null)}
                />
            )}
        </div>
    );
}