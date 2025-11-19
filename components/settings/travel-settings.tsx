"use client";

import { useState, useEffect } from "react";
import { Settings, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface TravelSettings {
  budgetRange: "€" | "€€" | "€€€" | "any";
  minSafetyScore: number;
  dietaryRestrictions: string[];
  maxDistance: number;
  openNow: boolean;
  eatingPreferences: {
    includeBreakfast: boolean;
    includeSnacks: boolean;
    style: "foodie" | "casual" | "efficient";
    preferredMealTimes?: {
      breakfast?: string;
      lunch?: string;
      dinner?: string;
    };
  };
  mobilityPreferences: {
    transportModes: ("walking" | "public_transit" | "taxi")[];
    wheelchairAccessible: boolean;
    maxWalkingDistance: number;
    preferredPace: "leisurely" | "moderate" | "efficient";
  };
  tripPreferences: {
    planningStyle: "structured" | "flexible";
    groupSize?: number;
    travelDates?: string;
  };
}

const defaultSettings: TravelSettings = {
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
    planningStyle: "flexible",
    groupSize: 2,
  },
};

interface TravelSettingsProps {
  onSettingsChange?: (settings: TravelSettings) => void;
  filteredCount?: number; // For Explorer mode to show filter results
  showFilterResults?: boolean; // Whether to show "X venues" indicator
}

export default function TravelSettings({ 
  onSettingsChange, 
  filteredCount = 0,
  showFilterResults = false 
}: TravelSettingsProps) {
  const [settings, setSettings] = useState<TravelSettings>(defaultSettings);
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const loadSettings = () => {
      const saved = localStorage.getItem('navegate-user-preferences');
      if (saved) {
        try {
          const parsedSettings = JSON.parse(saved);
          // Deep merge to properly handle nested objects
          const loadedSettings = {
            ...defaultSettings,
            ...parsedSettings,
            eatingPreferences: {
              ...defaultSettings.eatingPreferences,
              ...parsedSettings.eatingPreferences
            },
            mobilityPreferences: {
              ...defaultSettings.mobilityPreferences,
              ...parsedSettings.mobilityPreferences
            },
            tripPreferences: {
              ...defaultSettings.tripPreferences,
              ...parsedSettings.tripPreferences
            }
          };
          setSettings(loadedSettings);
          onSettingsChange?.(loadedSettings);
          console.log('✅ Settings loaded from localStorage:', loadedSettings);
        } catch (error) {
          console.error('Error loading settings:', error);
        }
      }
    };
    
    loadSettings();
  }, [onSettingsChange]);

  // Save settings to localStorage
  const saveSettings = () => {
    localStorage.setItem('navegate-user-preferences', JSON.stringify(settings));
    setHasUnsavedChanges(false);
    setSaveSuccess(true);
    onSettingsChange?.(settings);
    console.log('✅ Settings saved to localStorage:', settings);
    
    // Show success feedback briefly
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // Update setting and mark as unsaved
  const updateSetting = (path: string, value: string | number | boolean) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let current = newSettings as Record<string, unknown>;
      
      for (let i = 0; i < keys.length - 1; i++) {
        const currentValue = current[keys[i]];
        current[keys[i]] = { ...(currentValue && typeof currentValue === 'object' ? currentValue : {}) } as Record<string, unknown>;
        current = current[keys[i]] as Record<string, unknown>;
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
    setHasUnsavedChanges(true);
  };

  // Toggle dietary restriction
  const toggleDietaryRestriction = (restriction: string) => {
    setSettings(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(restriction)
        ? prev.dietaryRestrictions.filter(r => r !== restriction)
        : [...prev.dietaryRestrictions, restriction]
    }));
    setHasUnsavedChanges(true);
  };

  // Toggle transport mode
  const toggleTransportMode = (mode: "walking" | "public_transit" | "taxi") => {
    setSettings(prev => ({
      ...prev,
      mobilityPreferences: {
        ...prev.mobilityPreferences,
        transportModes: prev.mobilityPreferences.transportModes.includes(mode)
          ? prev.mobilityPreferences.transportModes.filter(m => m !== mode)
          : [...prev.mobilityPreferences.transportModes, mode]
      }
    }));
    setHasUnsavedChanges(true);
  };

  // Reload settings when dialog opens to catch external updates
  const handleOpenChange = (open: boolean) => {
    if (open) {
      const saved = localStorage.getItem('navegate-user-preferences');
      if (saved) {
        try {
          const parsedSettings = JSON.parse(saved);
          const reloadedSettings = {
            ...defaultSettings,
            ...parsedSettings,
            eatingPreferences: {
              ...defaultSettings.eatingPreferences,
              ...parsedSettings.eatingPreferences
            },
            mobilityPreferences: {
              ...defaultSettings.mobilityPreferences,
              ...parsedSettings.mobilityPreferences
            },
            tripPreferences: {
              ...defaultSettings.tripPreferences,
              ...parsedSettings.tripPreferences
            }
          };
          setSettings(reloadedSettings);
          console.log('🔄 Reloaded settings on dialog open:', reloadedSettings);
        } catch (error) {
          console.error('Error reloading settings:', error);
        }
      }
    }
    setIsOpen(open);
  };


  const budgetOptions = [
    { value: "€", label: "€ - Budget", desc: "Under €15 per meal" },
    { value: "€€", label: "€€ - Mid-range", desc: "€15-30 per meal" },
    { value: "€€€", label: "€€€ - Premium", desc: "€30+ per meal" },
    { value: "any", label: "Any Budget", desc: "Show all options" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 relative">
          <Settings className="w-4 h-4" />
          <span className="hidden sm:inline">Travel Settings</span>
          <span className="sm:hidden">Settings</span>
          
          {/* Active filters indicator */}
          {(settings.budgetRange !== "any" || settings.minSafetyScore > 70 || settings.openNow || settings.mobilityPreferences.wheelchairAccessible) && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" title="Active filters" />
          )}
          
          {/* Filter count for Explorer mode */}
          {showFilterResults && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
              {filteredCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="w-[95vw] max-w-2xl h-[90vh] max-h-[90vh] p-0 gap-0">
        <DialogHeader className="px-4 py-3 border-b">
          <DialogTitle className="text-lg font-semibold">Travel Settings</DialogTitle>
          {showFilterResults && (
            <p className="text-sm text-gray-600 mt-1">
              Currently showing {filteredCount} venues
            </p>
          )}
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {/* Quick Filters Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 text-sm border-b pb-2">Quick Filters</h3>
            
            {/* Budget Range */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Budget Range</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {budgetOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateSetting('budgetRange', option.value)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      settings.budgetRange === option.value
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-200 hover:border-green-300 text-gray-700"
                    }`}
                  >
                    <div className="font-medium text-sm">{option.label}</div>
                    <div className="text-xs text-gray-600">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Safety Score */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Minimum Safety Score: {settings.minSafetyScore}+
              </Label>
              <Slider
                value={[settings.minSafetyScore]}
                onValueChange={(values) => updateSetting('minSafetyScore', values[0])}
                max={95}
                min={50}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>50 - Basic</span>
                <span>75 - Good</span>
                <span>95 - Excellent</span>
              </div>
            </div>

            {/* Quick toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <Label htmlFor="open-now" className="text-sm font-medium">
                  Open now
                </Label>
                <Checkbox
                  id="open-now"
                  checked={settings.openNow}
                  onCheckedChange={(checked) => updateSetting('openNow', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <Label htmlFor="wheelchair" className="text-sm font-medium">
                  Wheelchair accessible
                </Label>
                <Checkbox
                  id="wheelchair"
                  checked={settings.mobilityPreferences.wheelchairAccessible}
                  onCheckedChange={(checked) => 
                    updateSetting('mobilityPreferences.wheelchairAccessible', checked)
                  }
                />
              </div>
            </div>
          </div>

          {/* Detailed Preferences Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 text-sm border-b pb-2">Detailed Preferences</h3>

            {/* Dietary Restrictions */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Additional Dietary Restrictions</Label>
              <div className="grid grid-cols-2 gap-2">
                {['gluten-free', 'nut-free', 'soy-free', 'oil-free'].map(restriction => (
                  <div key={restriction} className="flex items-center space-x-2 p-2">
                    <Checkbox
                      id={restriction}
                      checked={settings.dietaryRestrictions.includes(restriction)}
                      onCheckedChange={() => toggleDietaryRestriction(restriction)}
                    />
                    <Label htmlFor={restriction} className="text-sm capitalize">
                      {restriction}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Eating Style */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Eating Style</Label>
              <Select
                value={settings.eatingPreferences.style}
                onValueChange={(value: "foodie" | "casual" | "efficient") => 
                  updateSetting('eatingPreferences.style', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="foodie">Foodie - Exploring unique dishes</SelectItem>
                  <SelectItem value="casual">Casual - Easygoing meals</SelectItem>
                  <SelectItem value="efficient">Efficient - Quick bites</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Transport Modes */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Preferred Transportation</Label>
              <div className="space-y-2">
                {[
                  { key: 'walking' as const, label: 'Walking', desc: 'Up to 20 min walks' },
                  { key: 'public_transit' as const, label: 'Public Transit', desc: 'Buses, trains, metro' },
                  { key: 'taxi' as const, label: 'Taxi/Rideshare', desc: 'Uber, Lyft, local taxis' }
                ].map(transport => (
                  <div key={transport.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{transport.label}</div>
                      <div className="text-xs text-gray-600">{transport.desc}</div>
                    </div>
                    <Checkbox
                      id={transport.key}
                      checked={settings.mobilityPreferences.transportModes.includes(transport.key)}
                      onCheckedChange={() => toggleTransportMode(transport.key)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Walking Distance */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Max Walking Distance: {settings.mobilityPreferences.maxWalkingDistance} min
              </Label>
              <Slider
                value={[settings.mobilityPreferences.maxWalkingDistance]}
                onValueChange={(values) => 
                  updateSetting('mobilityPreferences.maxWalkingDistance', values[0])
                }
                max={30}
                min={5}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5 min</span>
                <span>15 min</span>
                <span>30 min</span>
              </div>
            </div>

            {/* Planning Style */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Planning Style</Label>
              <Select
                value={settings.tripPreferences.planningStyle}
                onValueChange={(value: "structured" | "flexible") => 
                  updateSetting('tripPreferences.planningStyle', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="structured">Structured - Everything planned</SelectItem>
                  <SelectItem value="flexible">Flexible - Spontaneous approach</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Save Button - Fixed at bottom */}
        <div className="flex justify-between items-center p-4 border-t bg-white">
          {saveSuccess && (
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <Check className="w-4 h-4" />
              Settings saved!
            </div>
          )}
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" onClick={() => setIsOpen(false)} size="sm">
              Cancel
            </Button>
            <Button
              onClick={saveSettings}
              disabled={!hasUnsavedChanges}
              className="gap-2"
              size="sm"
            >
              {hasUnsavedChanges ? 'Save Changes' : 'Saved'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}