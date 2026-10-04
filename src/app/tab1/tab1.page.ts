import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    FormsModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonInput,
    IonTitle,
    IonToolbar,
  ],
})
export class Tab1Page {
  counterName = '';
  count = 0;
  step = 1;

  increment(): void {
    this.count++;
  }

  decrement(): void {
    if (this.count > 0) {
      this.count--;
    }
  }

  incrementBy(val: number): void {
    this.count += Number(val);
  }

  decrementBy(val: number): void {
    const amount = Number(val);
    if (this.count - amount >= 0) {
      this.count -= amount;
    } else {
      this.count = 0;
    }
  }

  reset(): void {
    this.count = 0;
  }

  resetAll(): void {
    this.count = 0;
    this.counterName = '';
  }
}
