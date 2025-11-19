"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { type UserPreferences } from "@/components/preferences/user-preferences";

export type Persona = "structured" | "flexible";

function OnboardingContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    // Get initial persona from URL params
    const initialPersona = searchParams.get("persona") as Persona;
    const [persona] = useState<Persona | null>(initialPersona);

    const [preferences, setPreferences] = useState<Partial<UserPreferences>>(() => {
        const planningStyle = initialPersona === "structured" ? "structured" : "flexible";
        return {
            budgetRange: "any",
            minSafetyScore: 70,
            dietaryRestrictions: [],
            maxDistance: 2000,
            openNow: false,
            eatingPreferences: {
                includeBreakfast: true,
                includeSnacks: false,
                style: "casual",
            },
            mobilityPreferences: {
                transportModes: ["walking", "public_transit"],
                wheelchairAccessible: false,
                maxWalkingDistance: 15,
                preferredPace: "moderate",
            },
            tripPreferences: {
                planningStyle,
                groupSize: 2,
            },
        };
    });

    // Persona and preferences are now initialized directly from URL params

    // Define the onboarding steps
    const allSteps = [
        {
            id: "budget-dietary",
            title: "Budget & Dietary Needs",
            description: "Help us filter recommendations to your preferences",
            personas: ["structured", "flexible"] as Persona[],
        },
        {
            id: "travel-dates",
            title: "Travel Details",
            description: "When are you traveling?",
            personas: ["structured"] as Persona[],
        },
        {
            id: "eating-preferences",
            title: "Dining Preferences",
            description: "How do you like to experience food while traveling?",
            personas: ["structured"] as Persona[],
        },
        {
            id: "transportation",
            title: "Getting Around",
            description: "How do you prefer to travel between venues?",
            personas: ["structured"] as Persona[],
        },
    ];

    // Filter steps based on selected persona
    const availableSteps = allSteps.filter((step) => !persona || step.personas.includes(persona));

    const currentStepData = availableSteps[currentStep];
    const progress = ((currentStep + 1) / availableSteps.length) * 100;

    const canProceed = () => {
        if (!currentStepData) return false;

        switch (currentStepData.id) {
            case "budget-dietary":
                return preferences.budgetRange !== undefined;
            case "travel-dates":
                return (preferences.tripPreferences?.travelDates?.trim().length || 0) > 0;
            case "eating-preferences":
                return preferences.eatingPreferences?.style !== undefined;
            case "transportation":
                return (preferences.mobilityPreferences?.transportModes?.length || 0) > 0;
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (currentStep < availableSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            completeOnboarding();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        } else {
            // Go back to home page
            router.push("/");
        }
    };

    const completeOnboarding = () => {
        const finalPreferences: UserPreferences = {
            budgetRange: preferences.budgetRange || "any",
            minSafetyScore: preferences.minSafetyScore || 70,
            dietaryRestrictions: preferences.dietaryRestrictions || [],
            maxDistance: preferences.maxDistance || 2000,
            openNow: preferences.openNow || false,
            eatingPreferences: preferences.eatingPreferences || {
                includeBreakfast: true,
                includeSnacks: false,
                style: "casual",
            },
            mobilityPreferences: preferences.mobilityPreferences || {
                transportModes: ["walking", "public_transit"],
                wheelchairAccessible: false,
                maxWalkingDistance: 15,
                preferredPace: "moderate",
            },
            tripPreferences: preferences.tripPreferences || {
                planningStyle: persona === "structured" ? "structured" : "flexible",
                groupSize: 2,
            },
        };

        // Save preferences to localStorage
        localStorage.setItem("navegate-user-preferences", JSON.stringify(finalPreferences));

        // Route based on persona
        if (persona === "structured") {
            router.push("/chat");
        } else {
            // Flexible users get the map interface
            router.push("/map");
        }
    };

    const handleSkip = () => {
        const selectedPersona = persona || "flexible";
        const minimalPreferences: UserPreferences = {
            budgetRange: "any",
            minSafetyScore: 70,
            dietaryRestrictions: [],
            maxDistance: 2000,
            openNow: false,
            eatingPreferences: {
                includeBreakfast: true,
                includeSnacks: false,
                style: "casual",
            },
            mobilityPreferences: {
                transportModes: ["walking", "public_transit"],
                wheelchairAccessible: false,
                maxWalkingDistance: 15,
                preferredPace: "moderate",
            },
            tripPreferences: {
                planningStyle: selectedPersona === "structured" ? "structured" : "flexible",
                groupSize: 2,
            },
        };

        localStorage.setItem("navegate-user-preferences", JSON.stringify(minimalPreferences));

        // Route based on persona
        if (selectedPersona === "structured") {
            router.push("/chat");
        } else {
            router.push("/map");
        }
    };

    if (!currentStepData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
            {/* Header */}
            <div className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">N</span>
                            </div>
                            <span className="font-semibold text-gray-900">
                                Na<span className="text-green-600">Veg</span>ate
                            </span>
                        </div>

                        <button onClick={handleSkip} className="text-gray-500 hover:text-gray-700 transition-colors text-sm">
                            Skip
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                            <span>
                                Step {currentStep + 1} of {availableSteps.length}
                            </span>
                            <span>{Math.round(progress)}% complete</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-2xl mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-lg border p-8">
                    {/* Step Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{currentStepData.title}</h1>
                        {currentStepData.description && <p className="text-gray-600">{currentStepData.description}</p>}
                    </div>

                    {/* Step Content */}
                    <div className="mb-8">
                        {/* Render step content based on step ID */}
                        {currentStepData.id === "budget-dietary" && <BudgetDietaryStep preferences={preferences} setPreferences={setPreferences} />}

                        {currentStepData.id === "travel-dates" && <TravelDatesStep preferences={preferences} setPreferences={setPreferences} />}

                        {currentStepData.id === "eating-preferences" && <EatingPreferencesStep preferences={preferences} setPreferences={setPreferences} />}

                        {currentStepData.id === "transportation" && <TransportationStep preferences={preferences} setPreferences={setPreferences} />}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center">
                        <div>
                            {currentStep > 0 && (
                                <Button variant="outline" onClick={handleBack}>
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Previous
                                </Button>
                            )}
                        </div>

                        <Button onClick={handleNext} disabled={!canProceed()} className="bg-green-500 hover:bg-green-600">
                            {currentStep === availableSteps.length - 1 ? (
                                <>
                                    <Check className="w-4 h-4 mr-2" />
                                    Complete Setup
                                </>
                            ) : (
                                <>
                                    Continue
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Step Components

function BudgetDietaryStep({
    preferences,
    setPreferences,
}: {
    preferences: Partial<UserPreferences>;
    setPreferences: (updater: (prev: Partial<UserPreferences>) => Partial<UserPreferences>) => void;
}) {
    const budgetOptions = [
        { value: "€", label: "€ - Budget-friendly", desc: "Under €15 per meal" },
        { value: "€€", label: "€€ - Mid-range", desc: "€15-30 per meal" },
        { value: "€€€", label: "€€€ - Premium", desc: "€30+ per meal" },
        { value: "any", label: "Any - No preference", desc: "Show me everything" },
    ];

    const dietaryOptions = ["gluten-free", "nut-free", "soy-free", "oil-free"];

    return (
        <div className="space-y-8">
            {/* Budget Range */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Budget Range</h3>
                <div className="grid gap-3">
                    {budgetOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() =>
                                setPreferences((prev) => ({
                                    ...prev,
                                    budgetRange: option.value as "€" | "€€" | "€€€" | "any",
                                }))
                            }
                            className={`p-4 rounded-lg border text-left transition-all ${
                                preferences.budgetRange === option.value ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-300"
                            }`}
                        >
                            <div className="font-medium text-gray-900">{option.label}</div>
                            <div className="text-sm text-gray-600">{option.desc}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Dietary Restrictions */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Dietary Restrictions</h3>
                <div className="grid grid-cols-2 gap-3">
                    {dietaryOptions.map((restriction) => (
                        <button
                            key={restriction}
                            onClick={() => {
                                setPreferences((prev) => ({
                                    ...prev,
                                    dietaryRestrictions: prev.dietaryRestrictions?.includes(restriction)
                                        ? prev.dietaryRestrictions.filter((r) => r !== restriction)
                                        : [...(prev.dietaryRestrictions || []), restriction],
                                }));
                            }}
                            className={`p-3 rounded-lg border text-sm transition-all ${
                                preferences.dietaryRestrictions?.includes(restriction)
                                    ? "border-green-500 bg-green-50 text-green-700"
                                    : "border-gray-200 hover:border-green-300 text-gray-700"
                            }`}
                        >
                            {restriction}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function TravelDatesStep({
    preferences,
    setPreferences,
}: {
    preferences: Partial<UserPreferences>;
    setPreferences: (updater: (prev: Partial<UserPreferences>) => Partial<UserPreferences>) => void;
}) {
    return (
        <div className="space-y-6">
            <div>
                <label className="block text-lg font-medium text-gray-900 mb-3">When are you traveling?</label>
                <input
                    type="text"
                    placeholder="e.g., 20-23 Dec"
                    className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    style={{ fontSize: "16px" }}
                    value={preferences.tripPreferences?.travelDates || ""}
                    onChange={(e) =>
                        setPreferences((prev) => ({
                            ...prev,
                            tripPreferences: {
                                planningStyle: prev.tripPreferences?.planningStyle || "flexible",
                                ...prev.tripPreferences,
                                travelDates: e.target.value,
                            },
                        }))
                    }
                />
                <p className="text-sm text-gray-500 mt-2">We&apos;ll use this to plan your day-by-day itinerary with proper timing</p>
            </div>
        </div>
    );
}

function EatingPreferencesStep({
    preferences,
    setPreferences,
}: {
    preferences: Partial<UserPreferences>;
    setPreferences: (updater: (prev: Partial<UserPreferences>) => Partial<UserPreferences>) => void;
}) {
    const eatingStyles = [
        { value: "foodie", label: "Foodie", desc: "I want to explore unique and creative vegan dishes" },
        { value: "casual", label: "Casual", desc: "I prefer familiar, easygoing meals" },
        { value: "efficient", label: "Efficient", desc: "I want quick, convenient food options" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Eating Style</h3>
                <div className="space-y-3">
                    {eatingStyles.map((style) => (
                        <button
                            key={style.value}
                            onClick={() =>
                                setPreferences((prev) => ({
                                    ...prev,
                                    eatingPreferences: {
                                        includeBreakfast: true,
                                        includeSnacks: false,
                                        ...prev.eatingPreferences,
                                        style: style.value as "foodie" | "casual" | "efficient",
                                    },
                                }))
                            }
                            className={`w-full p-4 rounded-lg border text-left transition-all ${
                                preferences.eatingPreferences?.style === style.value ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-300"
                            }`}
                        >
                            <div className="font-medium text-gray-900">{style.label}</div>
                            <div className="text-sm text-gray-600">{style.desc}</div>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <button
                    onClick={() =>
                        setPreferences((prev) => ({
                            ...prev,
                            eatingPreferences: {
                                includeSnacks: false,
                                style: "casual" as const,
                                ...prev.eatingPreferences,
                                includeBreakfast: !(prev.eatingPreferences?.includeBreakfast ?? false),
                            },
                        }))
                    }
                    className={`w-full p-4 rounded-lg border text-left transition-all ${
                        preferences.eatingPreferences?.includeBreakfast ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-300"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium text-gray-900">Include breakfast recommendations</div>
                            <div className="text-sm text-gray-600">Add breakfast venues to your daily itinerary</div>
                        </div>
                        <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                preferences.eatingPreferences?.includeBreakfast ? "border-green-500 bg-green-500" : "border-gray-300"
                            }`}
                        >
                            {preferences.eatingPreferences?.includeBreakfast && <Check className="w-3 h-3 text-white" />}
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
}

function TransportationStep({
    preferences,
    setPreferences,
}: {
    preferences: Partial<UserPreferences>;
    setPreferences: (updater: (prev: Partial<UserPreferences>) => Partial<UserPreferences>) => void;
}) {
    const transportModes = [
        { key: "walking" as const, label: "Walking", desc: "I enjoy walking between venues (up to 20 min)" },
        { key: "public_transit" as const, label: "Public Transit", desc: "Buses, trains, metro systems" },
        { key: "taxi" as const, label: "Taxi/Rideshare", desc: "Uber, Lyft, local taxis" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Transportation Preferences</h3>
                <p className="text-gray-600 mb-6 text-sm">Select all that apply. This helps us calculate travel times in your itinerary.</p>
                <div className="space-y-3">
                    {transportModes.map((transport) => (
                        <button
                            key={transport.key}
                            onClick={() => {
                                setPreferences((prev) => ({
                                    ...prev,
                                    mobilityPreferences: {
                                        wheelchairAccessible: false,
                                        maxWalkingDistance: 15,
                                        preferredPace: "moderate" as const,
                                        ...prev.mobilityPreferences,
                                        transportModes: prev.mobilityPreferences?.transportModes?.includes(transport.key)
                                            ? prev.mobilityPreferences.transportModes.filter((m) => m !== transport.key)
                                            : [...(prev.mobilityPreferences?.transportModes || ["walking", "public_transit"]), transport.key],
                                    },
                                }));
                            }}
                            className={`w-full p-4 rounded-lg border text-left transition-all ${
                                preferences.mobilityPreferences?.transportModes?.includes(transport.key)
                                    ? "border-green-500 bg-green-50"
                                    : "border-gray-200 hover:border-green-300"
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium text-gray-900">{transport.label}</div>
                                    <div className="text-sm text-gray-600">{transport.desc}</div>
                                </div>
                                <div
                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                        preferences.mobilityPreferences?.transportModes?.includes(transport.key) ? "border-green-500 bg-green-500" : "border-gray-300"
                                    }`}
                                >
                                    {preferences.mobilityPreferences?.transportModes?.includes(transport.key) && <Check className="w-3 h-3 text-white" />}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <button
                    onClick={() =>
                        setPreferences((prev) => ({
                            ...prev,
                            mobilityPreferences: {
                                transportModes: ["walking", "public_transit"],
                                maxWalkingDistance: 15,
                                preferredPace: "moderate" as const,
                                ...prev.mobilityPreferences,
                                wheelchairAccessible: !(prev.mobilityPreferences?.wheelchairAccessible ?? false),
                            },
                        }))
                    }
                    className={`w-full p-4 rounded-lg border text-left transition-all ${
                        preferences.mobilityPreferences?.wheelchairAccessible ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-300"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium text-gray-900">Wheelchair accessibility required</div>
                            <div className="text-sm text-gray-600">Only show venues with confirmed accessibility</div>
                        </div>
                        <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                preferences.mobilityPreferences?.wheelchairAccessible ? "border-green-500 bg-green-500" : "border-gray-300"
                            }`}
                        >
                            {preferences.mobilityPreferences?.wheelchairAccessible && <Check className="w-3 h-3 text-white" />}
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
}

export default function OnboardingPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <span className="text-white font-bold text-sm">V</span>
                        </div>
                        <p className="text-gray-600">Loading...</p>
                    </div>
                </div>
            }
        >
            <OnboardingContent />
        </Suspense>
    );
}
