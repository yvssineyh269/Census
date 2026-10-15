import { useIsMobile } from "@/hooks/use-mobile";
import { ProductSchemaDataForm } from "@/schemas/zod/product.schema";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";

export function TableCellViewer({item}: {item: ProductSchemaDataForm}) {
    const isMobile = useIsMobile();
    return (
        <Drawer>
            <DrawerTrigger>
                {item.name}
            </DrawerTrigger>

            <DrawerContent>
                
            </DrawerContent>
        </Drawer>
    )
}