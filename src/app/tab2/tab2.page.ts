import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AlertController,
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { CounterService } from '../services/counter.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    DatePipe,
    FormsModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonTitle,
    IonToolbar,
  ],
})
export class Tab2Page implements OnInit {
  readonly counterService = inject(CounterService);
  private readonly alertController = inject(AlertController);
  private readonly toastController = inject(ToastController);

  searchQuery = signal('');
  sortOrder = signal<'newest' | 'oldest' | 'name' | 'value-desc' | 'value-asc'>('newest');

  readonly totalSum = computed(() => {
    return this.counterService.counters().reduce((sum, c) => sum + c.value, 0);
  });

  readonly filteredCounters = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    let result = this.counterService.counters();

    if (query) {
      result = result.filter((c) => c.name.toLowerCase().includes(query));
    }

    const sort = this.sortOrder();
    return [...result].sort((a, b) => {
      switch (sort) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'name':
          return a.name.localeCompare(b.name, 'cs');
        case 'value-desc':
          return b.value - a.value;
        case 'value-asc':
          return a.value - b.value;
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  });

  async ngOnInit(): Promise<void> {
    await this.counterService.initialize();
  }

  async remove(id: string): Promise<void> {
    await this.counterService.remove(id);
    await this.showToast('Záznam byl odstraněn.');
  }

  async clear(): Promise<void> {
    await this.counterService.clear();
    await this.showToast('Historie byla vymazána.');
  }

  async confirmClear(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Potvrzení vymazání',
      message: 'Opravdu chcete vymazat celou historii počítadel?',
      buttons: [
        {
          text: 'Zrušit',
          role: 'cancel',
        },
        {
          text: 'Vymazat',
          role: 'destructive',
          handler: () => {
            this.clear();
          },
        },
      ],
    });

    await alert.present();
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
