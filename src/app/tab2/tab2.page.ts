import { Component, OnInit, OnDestroy } from '@angular/core';
import { FoodService } from '../services/food.service';
import { Food } from '../interfaces/food.interface';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ModalController, AlertController } from '@ionic/angular';
import { EditModal } from './edit-modal';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, OnDestroy {

  allFoodInFreezer: Food[] = [];

  sub! : Subscription;
  isLoading: boolean = false;

  constructor(private foodService : FoodService, 
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
    ) {}

  ngOnInit(): void {

   
  //  this.allFoodInFreezer = this.foodService.allFood;


    this.sub = this.foodService.allFood().subscribe(data => {
  this.allFoodInFreezer = data.map(e => {
    const foodItem = {
      id : e.payload.doc.id,
    ...(e.payload.doc.data() as any)
    } as Food;

    console.log('foodItem', foodItem);
    
    return foodItem;
    
    
  })
    }, err => {} );

    console.log('ngOnInit', this.allFoodInFreezer );
    
  }

  ionViewWillEnter () {

  //  this.allFoodInFreezer = this.foodService.allFood;

    console.log('ionViewWillEnter', this.allFoodInFreezer ); 
  }

  async edit(id: string) {
    console.log('id', id);
    const modal = await this.modalCtrl.create({

      component: EditModal,
      componentProps: {'foodId': id}
    });
    return await modal.present();
  }

  async delete(id: string) {
    console.log('id', id);
    this.isLoading = true;
    
    const alert = await this.alertCtrl.create({
      header: 'Supprimer ce aliment ?',
      subHeader: 'Décision irréversible',
      buttons: [
      {text:'annuler',
      cssClass: 'primary',
      role: 'cancel',
      handler:() => {
      this.isLoading = false;
      }
      },
      {
        text: 'Supprimer',
        cssClass: 'danger',
        handler:() => {
          this.foodService
          .deleteFood(id)
          .pipe(take(1))
          .subscribe(data => {
            this.isLoading = false;
          }, err => {
      
            this.isLoading = false;
            console.error(err);
            
          });
        }
      }
      ]
    })
  await alert.present();  
  }

  ngOnDestroy(): void {
      this.sub.unsubscribe();
  }

}
