/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FoodService } from 'src/app/services/food.service';
import { Food } from 'src/app/interfaces/food.interface';
import { ModalController, ToastController } from '@ionic/angular';
import { DocumentSnapshot } from '@angular/fire/firestore';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import categories from '../shared/food-categories'
import { Category } from './../interfaces/category.interface';


@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.html'
})
export class EditModal implements OnInit, OnDestroy {
  @Input() foodId?: string;
  foodItem?: Food;
  sub!: Subscription;
  form!: FormGroup;
  allCategories: Category[] = categories;


  constructor(
    private foodService: FoodService,
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private toastCtrl: ToastController
    
  ) {}

  ngOnInit() {

  this.allCategories = categories;
    if (this.foodId) {  // Ensure that foodId is defined before making the subscription
      this.sub = this.foodService.getFood(this.foodId).subscribe(
        (foodItem: Food | undefined) => {  // Adjust the type based on what getFood actually returns
          if (foodItem) {
            this.foodItem = foodItem;
            this.createForm();
            console.log('this.foodItem', this.foodItem);
          } else {
            // Handle the case when foodItem is undefined
            console.error('Food item not found');
          }
        },
        (err) => {
          console.error(err);
        }
      );
    } else {
      console.error('Food ID is undefined');
    }
  }  

  createForm() {
    this.form = this.fb.group({
      foodName: [this.foodItem ? this.foodItem.foodName : '', Validators.required],
      category: [this.foodItem && this.foodItem.category ? this.foodItem.category : '', Validators.required],
      datePlacedInFreezer: [this.foodItem ? this.foodItem.datePlacedInFreezer : '', Validators.required]
    });
  }
  

 update() {
    console.log(this.form.value);
    const updateFood = {...this.form.value, id: this.foodItem?.id};
    this.foodService.updateFood(updateFood).subscribe(async () => {
        const toast = await this.toastCtrl.create({
            message: 'update à réussi',
            duration: 2000,
            color: 'primary',
            position: 'bottom',
        });

    await toast.present();
        
    })
  }

  goback(){
    this.modalCtrl.dismiss();
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    
  }
}
}
