import { saleSelectBySaleperson } from "./saleperson.query";

const historicOfSale = {
    ...saleSelectBySaleperson,
    soldAt: true,
    saleperson: {
        select: {
            id: true,
            name: true,
        }
    }
}