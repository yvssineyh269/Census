type RouteAccessMap = {
    [key: string] : string[];
}

export const routeAccessMap : RouteAccessMap = {
    "/admin(.*)": ["admin"],
    "/saleperson(.*)": ["saleperson"],
    "/manager(.*)": ["manager"],
    "/accountant(.*)": ["accountant"],
    "/assistant(.*)": ["assistant"]
};