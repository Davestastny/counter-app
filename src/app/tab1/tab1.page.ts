import { Component, inject } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { CounterComponent } from '../components/counter/counter.component';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from '../services/counter.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [CounterComponent, IonContent, IonHeader, IonTitle, IonToolbar],
})
export class Tab1Page {
  private readonly counterService = inject(CounterService);
  private readonly toastController = inject(ToastController);

  async onSaved(counter: SavedCounter): Promise<void> {
    await this.counterService.add(counter);
    await this.showToast(`Počítadlo "${counter.name}" bylo úspěšně uloženo.`);
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }
}
