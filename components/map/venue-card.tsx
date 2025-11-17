"use client";

import { X, ExternalLink, Clock, MapPin, Shield, Euro } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Venue {
    id: string;
    category: string;
    name: string;
    description: string;
    location: {
        coordinates: { lat: number; lng: number };
        address: string;
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

interface VenueCardProps {
    venue: Venue;
    onClose: () => void;
}

export default function VenueCard({ venue, onClose }: VenueCardProps) {
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
        if (score >= 80) return "text-green-600 bg-green-50";
        if (score >= 60) return "text-yellow-600 bg-yellow-50";
        return "text-red-600 bg-red-50";
    };

    const getSafetyLabel = (score: number) => {
        if (score >= 90) return "Excellent";
        if (score >= 80) return "Very Good";
        if (score >= 70) return "Good";
        if (score >= 60) return "Fair";
        return "Needs Caution";
    };

    const getCurrentStatus = () => {
        if (!venue.logistics.hours) return null;
        
        const now = new Date();
        const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const currentHours = venue.logistics.hours[currentDay];
        
        if (!currentHours || currentHours.toLowerCase() === 'closed') {
            return { status: 'closed', text: 'Closed' };
        }
        
        return { status: 'open', text: 'Open' };
    };

    const currentStatus = getCurrentStatus();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-end sm:items-center sm:justify-center p-4">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[85vh] sm:max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-start justify-between p-4 pb-2">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{getCategoryIcon(venue.category)}</span>
                            <h3 className="font-semibold text-lg text-gray-900 truncate">
                                {venue.name}
                            </h3>
                            <Badge variant="outline" className="capitalize text-xs">
                                {venue.category}
                            </Badge>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {venue.description}
                        </p>
                    </div>
                    
                    <Button variant="ghost" size="sm" onClick={onClose} className="flex-shrink-0 ml-2">
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Content */}
                <div className="px-4 pb-4 space-y-4 overflow-y-auto max-h-[calc(85vh-80px)]">
                    {/* Safety Score */}
                    <div className={`p-3 rounded-lg ${getSafetyColor(venue.safetyScore.score)}`}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                <span className="font-medium text-sm">Safety Score</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-lg">{venue.safetyScore.score}</span>
                                <Badge variant="outline" className="text-xs">
                                    {getSafetyLabel(venue.safetyScore.score)}
                                </Badge>
                            </div>
                        </div>
                        {venue.safetyScore.reasoning && (
                            <p className="text-sm opacity-90">
                                {venue.safetyScore.reasoning}
                            </p>
                        )}
                    </div>

                    {/* Quick Info */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Pricing */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                                <Euro className="w-4 h-4 text-gray-600" />
                                <span className="font-medium text-sm">Price</span>
                            </div>
                            <div className="text-lg font-semibold text-gray-900">
                                {venue.logistics.pricing?.range || "N/A"}
                            </div>
                            {venue.logistics.pricing?.average_meal && (
                                <div className="text-xs text-gray-600">
                                    {venue.logistics.pricing.average_meal}
                                </div>
                            )}
                        </div>

                        {/* Status */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                                <Clock className="w-4 h-4 text-gray-600" />
                                <span className="font-medium text-sm">Status</span>
                            </div>
                            {currentStatus ? (
                                <div className={`text-lg font-semibold ${
                                    currentStatus.status === 'open' ? 'text-green-600' : 'text-gray-600'
                                }`}>
                                    {currentStatus.text}
                                </div>
                            ) : (
                                <div className="text-lg font-semibold text-gray-600">
                                    See hours
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-gray-600" />
                            <span className="font-medium text-sm">Location</span>
                        </div>
                        <p className="text-sm text-gray-700 pl-6">
                            {venue.location.address}
                        </p>
                    </div>

                    {/* Booking Info */}
                    {venue.logistics.booking && (
                        <div>
                            <div className="font-medium text-sm mb-2">Booking</div>
                            <div className="text-sm text-gray-700 space-y-1">
                                <p>
                                    <span className={venue.logistics.booking.required ? 'text-orange-600' : 'text-green-600'}>
                                        {venue.logistics.booking.required ? 'Reservations required' : 'Walk-ins welcome'}
                                    </span>
                                </p>
                                {venue.logistics.booking.advance_notice && (
                                    <p className="text-gray-600">
                                        {venue.logistics.booking.advance_notice}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Accessibility */}
                    {venue.logistics.accessibility && (
                        <div>
                            <div className="font-medium text-sm mb-2">Accessibility</div>
                            <div className="space-y-1">
                                {venue.logistics.accessibility.wheelchair && (
                                    <Badge variant="outline" className="text-xs">
                                        ♿ Wheelchair accessible
                                    </Badge>
                                )}
                                {venue.logistics.accessibility.dietary_accommodations?.map((accommodation, index) => (
                                    <Badge key={index} variant="outline" className="text-xs mr-2">
                                        {accommodation}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Operating Hours */}
                    {venue.logistics.hours && (
                        <div>
                            <div className="font-medium text-sm mb-2">Hours</div>
                            <div className="space-y-1 text-sm">
                                {Object.entries(venue.logistics.hours).map(([day, hours]) => (
                                    <div key={day} className="flex justify-between">
                                        <span className="capitalize text-gray-600">
                                            {day}
                                        </span>
                                        <span className="text-gray-900">{hours}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Website Link */}
                    {venue.website && (
                        <a 
                            href={venue.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md font-medium transition-colors"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Visit Website
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}