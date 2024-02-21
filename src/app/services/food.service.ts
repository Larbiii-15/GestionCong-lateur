import { Injectable } from '@angular/core';
import {AngularFirestore, DocumentReference, DocumentSnapshot, Action} from '@angular/fire/compat/firestore';
import { DocumentChangeAction } from '@angular/fire/compat/firestore';
import {from, Observable} from 'rxjs';
import { Food } from '../interfaces/food.interface';
import { Category } from '../interfaces/category.interface';


@Injectable({
  providedIn: 'root'
})
export class FoodService {

  //private _allFood : Food[] = [];

  //get allFood () {

   // return this._allFood;
 // }

  constructor(private afs : AngularFirestore) { }

  allFood () {

    //return this.afs.collection('freezer').snapshotChanges();
    const freezerCollectionRef = this.afs.collection<Food>('freezer', ref => ref.orderBy('foodName', 'asc'));
    return freezerCollectionRef.snapshotChanges();
  }

  getFood(id: string): Observable<Food | undefined> {
    return this.afs.doc<Food>(`freezer/${id}`).valueChanges();
  }

  addFood (foodItem : Food): Promise <DocumentReference <any>> {

  return this.afs.collection('freezer').add(foodItem);
    
  }

  computeMaxDateToKeepFood(category: Category, datePlacedInFreeze: string): Date {
    const securityMarginInDays = 7;
    const maxStayInFreezerInDays = category.maxStayInFreezerInMonth * 30;
    const maxStayInFreezerInDaysWithMargin = maxStayInFreezerInDays - securityMarginInDays;
    
    const currentDate = new Date(datePlacedInFreeze);
    const finaleDate = currentDate.setDate(currentDate.getDate() + maxStayInFreezerInDaysWithMargin);
    console.log('finaleDate', finaleDate);
    
    return new Date(finaleDate);
  } 
  
  getFoodToEatBeforeDaysAgo(nbOfDaysInFreezer: number): Observable<Food[]> {
    const daysInMilliseconds = nbOfDaysInFreezer * 24 * 3600 * 1000;
    const dateInFuture = new Date(Date.now() + daysInMilliseconds);
    return this.afs
      .collection('freezer', ref => ref.where('betterToEatBefore', '<', dateInFuture))
      .valueChanges() as Observable<Food[]>;
  }


  updateFood(food: Food): Observable<any> {

    return from(this.afs.doc(`freezer/${food.id}`).update(food));
  }

  deleteFood(id: string): Observable <any> {

    return from(this.afs.doc(`freezer/${id}`).delete());
  }
}
