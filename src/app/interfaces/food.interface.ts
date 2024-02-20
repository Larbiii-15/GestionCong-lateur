import { Category } from "./category.interface";

export interface Food {
    payload: any;

    id? : string;
    foodName : string;
    datePlacedInFreezer : string; 
    category?: Category;
    betterToEatBefore?: Date;
}