import Link from "next/link";
import { Bot, MapPin, Utensils, Hotel, Calendar, ClipboardList, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <div className="min-h-screen bg-linear-to-b from-green-50 to-white">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">
                                    Na<span className="text-green-600">Veg</span>ate
                                </h1>
                                <p className="text-sm text-gray-600">AI-Powered Vegan Travel Intelligence</p>
                            </div>
                        </div>
                        <Link href="/onboarding?persona=structured">
                            <Button className="bg-green-500 hover:bg-green-600">
                                <Bot className="w-4 h-4 mr-2" />
                                Try Demo
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Na<span className="text-green-600">Veg</span>ate: AI-Powered Vegan Travel Intelligence
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        The first travel app that adapts to YOUR travel personality. Stop juggling multiple apps: get comprehensive vegan travel intelligence{" "}
                        <span className="whitespace-nowrap">in one place</span>.
                    </p>

                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">How do you prefer to travel?</h3>

                        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                            {/* Structured Planner */}
                            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200 hover:border-green-400 transition-colors cursor-pointer group">
                                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                                    <ClipboardList className="w-8 h-8 text-blue-600" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-3">Structured Itinerary</h4>
                                <p className="text-gray-600 mb-4 text-sm">
                                    Complete planning with detailed schedules, booking links, and calendar exports. Perfect for advance planners who want everything
                                    organized.
                                </p>
                                <ul className="text-xs text-gray-500 mb-6 space-y-1">
                                    <li>• Daily itineraries with timing</li>
                                    <li>• Calendar integration (.ics export)</li>
                                    <li>• Booking coordination</li>
                                    <li>• Transport planning</li>
                                </ul>
                                <Link href="/onboarding?persona=structured">
                                    <Button className="w-full bg-blue-500 hover:bg-blue-600">
                                        <Bot className="w-4 h-4 mr-2" />
                                        Start Planning
                                    </Button>
                                </Link>
                            </div>

                            {/* Flexible Explorer */}
                            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200 hover:border-green-400 transition-colors cursor-pointer group">
                                <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-lg mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                                    <Compass className="w-8 h-8 text-orange-600" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-3">Flexible Exploration</h4>
                                <p className="text-gray-600 mb-4 text-sm">
                                    Real-time discovery with interactive maps and filtering. Perfect for spontaneous travelers who explore as they go.
                                </p>
                                <ul className="text-xs text-gray-500 mb-6 space-y-1">
                                    <li>• Interactive venue mapping</li>
                                    <li>• Distance & budget filtering</li>
                                    <li>• Real-time recommendations</li>
                                    <li>• Spontaneous discovery</li>
                                </ul>
                                <Link href="/onboarding?persona=flexible">
                                    <Button className="w-full bg-orange-500 hover:bg-orange-600">
                                        <Compass className="w-4 h-4 mr-2" />
                                        Start Exploring
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-500 mb-4">
                            Both experiences use the same comprehensive safety data across restaurants, accommodations, tours, and events.
                        </p>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
                    <div className="bg-white rounded-lg p-6 shadow-sm border">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                            <Utensils className="w-6 h-6 text-orange-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Food & Dining</h3>
                        <p className="text-gray-600 text-sm">Restaurants, cafes, bars, ice cream shops with safety analysis</p>
                        <div className="mt-3 text-sm text-green-600 font-medium">32 listings • 0-98 safety scores</div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                            <Hotel className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Accommodations</h3>
                        <p className="text-gray-600 text-sm">Kitchen safety, vegan breakfast, bedding materials, host knowledge</p>
                        <div className="mt-3 text-sm text-green-600 font-medium">5 listings • 48-84 safety scores</div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                            <MapPin className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Tours</h3>
                        <p className="text-gray-600 text-sm">Guide expertise, meal handling, group dynamics, hidden animal exploitation</p>
                        <div className="mt-3 text-sm text-green-600 font-medium">4 listings • 75-94 safety scores</div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                            <Calendar className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Events</h3>
                        <p className="text-gray-600 text-sm">Food quality, accessibility, community atmosphere, inclusivity</p>
                        <div className="mt-3 text-sm text-green-600 font-medium">4 listings • 88-92 safety scores</div>
                    </div>
                </div>

                {/* Why NaVegate Section */}
                <div className="mt-16 bg-white rounded-lg p-8 shadow-sm border">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Why Na<span className="text-green-600">Veg</span>ate?
                        </h3>
                        <p className="text-gray-600">The first complete vegan travel intelligence platform that solves the fragmented research problem.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="text-red-500">❌</span>
                                Current Fragmented Experience
                            </h4>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                                    <div className="text-sm text-gray-600">HappyCow for restaurants only</div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                                    <div className="text-sm text-gray-600">Vegvisits for accommodations only</div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                                    <div className="text-sm text-gray-600">Google for tours and activities</div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                                    <div className="text-sm text-gray-600">Eventbrite, Facebook for events</div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                                    <div className="text-sm text-gray-600">Hours of research per trip</div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="text-green-500">✅</span>
                                <span>
                                    Na<span className="text-green-600">Veg</span>ate
                                </span>{" "}
                                Complete Solution
                            </h4>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                    <div className="text-sm text-gray-600">All categories in one AI-powered platform</div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                    <div className="text-sm text-gray-600">Explainable safety scores with review citations</div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                    <div className="text-sm text-gray-600">Actionable logistics: hours, booking, pricing</div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                    <div className="text-sm text-gray-600">Adapts to your travel personality</div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                    <div className="text-sm text-gray-600">Complete trip intelligence in minutes</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-green-800 font-medium">
                            🎯 <strong>Demo Focus:</strong> Currently featuring comprehensive Berlin data with 45 venues across all categories.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
