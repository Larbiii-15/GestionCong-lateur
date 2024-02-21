import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Food } from '../interfaces/food.interface';
import { FoodService } from '../services/food.service';
import { Subscription } from 'rxjs';
import { Timestamp } from 'firebase/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { Category } from '../interfaces/category.interface';
import foodCategories from '../shared/food-categories';



@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, OnDestroy {
  allFoodToEatSoon: Food[] = []; 
  nbOfDaysAgo = 15; 
  sub!: Subscription;

  constructor(private foodService: FoodService,
    
    private changeDetectorRef: ChangeDetectorRef  
    ) {}

  ngOnInitt() {
    this.getFoodToEatBeforeDaysAgo();
  }


  getFoodToEatBeforeDaysAgo() {
    this.sub = this.foodService.getFoodToEatBeforeDaysAgo(this.nbOfDaysAgo).subscribe(data => {
      console.log('Foods to eat before the specified days:', data);
      this.allFoodToEatSoon = data.map(foodItem => {
        const betterToEatBefore = foodItem.betterToEatBefore instanceof firebase.firestore.Timestamp 
          ? foodItem.betterToEatBefore.toDate() 
          : foodItem.betterToEatBefore;
  
        const datePlacedInFreezer = foodItem.datePlacedInFreezer instanceof firebase.firestore.Timestamp 
          ? foodItem.datePlacedInFreezer.toDate() 
          : foodItem.datePlacedInFreezer;
  
        return {
          ...foodItem,
          betterToEatBefore: betterToEatBefore,
          datePlacedInFreezer: datePlacedInFreezer
        };
      });
      this.changeDetectorRef.detectChanges(); // Trigger change detection
    }, error => {
      console.error('Error fetching food items:', error);
      this.allFoodToEatSoon = [];
    });
  }
  
  

  ionViewWillEnter() {
    this.getFoodToEatBeforeDaysAgo();
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
 

ngOnInit() {
  
  this.allFoodToEatSoon = [
    
    {
      id: 'test-food-1',
      foodName: 'Test Food Item 1',
      category: foodCategories[0], 
      datePlacedInFreezer: new Date(),
      betterToEatBefore: new Date(new Date().getTime() + (this.nbOfDaysAgo - 1) * 86400000), 
    },
    
  ];
}
  
  

}
