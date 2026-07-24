import { useState } from "react";

import {
    Store,
    Palette,
    Globe,
    Sparkles
} from "lucide-react";

import Card from "./ui/Card";
import Tabs from "./ui/Tabs";

import RestaurantSettings from "./settings/RestaurantSettings";
import AppearanceSettings from "./settings/AppearanceSettings";
import SocialSettings from "./settings/SocialSettings";
import AISettings from "./settings/AISettings";

export default function AdminSettings() {

    const [activeTab, setActiveTab] = useState("restaurant");

    const tabs = [

        {
            id: "restaurant",
            label: "Restaurante",
            icon: <Store size={18} />
        },

        {
            id: "appearance",
            label: "Aparência",
            icon: <Palette size={18} />
        },

        {
            id: "social",
            label: "Redes Sociais",
            icon: <Globe size={18} />
        },

        {
            id: "ai",
            label: "Inteligência Artificial",
            icon: <Sparkles size={18} />
        }

    ];

    function renderContent() {

        switch (activeTab) {

            case "restaurant":
                return <RestaurantSettings />;

            case "appearance":
                return <AppearanceSettings />;

            case "social":
                return <SocialSettings />;

            case "ai":
                return <AISettings />;

            default:
                return <RestaurantSettings />;

        }

    }

    return (

        <Card title="Configurações">

            <Tabs
                tabs={tabs}
                activeTab={activeTab}
                onChange={setActiveTab}
            />

            {renderContent()}

        </Card>

    );

}