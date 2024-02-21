import { Category } from "./category.interface";

export interface Food {
    

    id? : string;
    foodName : string;
    datePlacedInFreezer : string; 
    category?: Category;
    betterToEatBefore?: Date;
}