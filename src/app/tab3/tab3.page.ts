import { Component, OnInit, OnDestroy } from '@angular/core';
import { Food } from '../interfaces/food.interface';
import { FoodService } from '../services/food.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, OnDestroy {
  allFoodToEatSoon!: Food[];
  nbOfDaysAgo = 15; 
  sub!: Subscription;

  constructor(private foodService: FoodService) {}

  ngOnInit() {
    this.getFoodToEatBeforeDaysAgo();
  }

  getFoodToEatBeforeDaysAgo() {
    this.sub = this.foodService.getFoodToEatBeforeDaysAgo(this.nbOfDaysAgo).subscribe(data => {
      console.log('getFoodToEatBeforeDaysAgo / data >>>>', data);
      this.allFoodToEatSoon = data.map(foodItem => {
        console.log('foodItem', foodItem);
        return {
          betterToEatBefore: (foodItem.betterToEatBefore as any).toDate(),
          foodName: foodItem.foodName,
          datePlacedInFreezer: (foodItem.datePlacedInFreezer as any).toDate(),
          category: foodItem.category
        };
      });
    });
  }

  ionViewWillEnter() {
    this.getFoodToEatBeforeDaysAgo();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
