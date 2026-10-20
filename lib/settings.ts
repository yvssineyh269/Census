import type { Role } from "./roles";

type RouteAccessMap = {
    [key: string] : Role[];
}

// Toutes les routes qui matchent sont vérifiées : une route plus précise
// (ex. /pages/personnals/add) peut restreindre davantage une route parente.
export const routeAccessMap : RouteAccessMap = {
    "/admin(/.*)?": ["admin"],
    "/saleperson(/.*)?": ["saleperson"],
    "/manager(/.*)?": ["manager"],
    "/accountant(/.*)?": ["accountant"],
    "/assistant(/.*)?": ["assistant"],

    "/pages/inventory(/.*)?": ["admin", "assistant", "manager"],
    "/pages/historic(/.*)?": ["admin", "accountant", "manager"],
    "/pages/personnals(/.*)?": ["admin", "manager", "accountant"],
    "/pages/personnals/add(/.*)?": ["admin"],
    // Toute autre page sous /pages exige au minimum d'être connecté
    "/pages(/.*)?": ["admin", "saleperson", "manager", "accountant", "assistant"],
};
