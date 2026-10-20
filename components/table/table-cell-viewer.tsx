import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import { ProductSchemaDataForm } from "@/lib/types";

export function TableCellViewer({item}: {item: ProductSchemaDataForm}) {
    const isMobile = useIsMobile();
    return (
        <Drawer>
            <DrawerTrigger>
                {item.productName}
            </DrawerTrigger>

            <DrawerContent>
                
            </DrawerContent>
        </Drawer>
    )
}