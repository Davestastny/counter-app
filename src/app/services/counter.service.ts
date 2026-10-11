import { Injectable, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { SavedCounter } from '../models/saved-counter';

@Injectable({
  providedIn: 'root',
})
export class CounterService {
  private readonly storageKey = 'saved-counters';
  private readonly countersState = signal<SavedCounter[]>([]);
  private readonly initializedState = signal(false);
  private initializationPromise: Promise<void> | null = null;

  readonly counters = this.countersState.asReadonly();
  readonly initialized = this.initializedState.asReadonly();

  initialize(): Promise<void> {
    this.initializationPromise ??= this.load();
    return this.initializationPromise;
  }

  async add(counter: SavedCounter): Promise<void> {
    await this.initialize();
    this.countersState.update((counters) => [counter, ...counters]);
    await this.persist();
  }

  async remove(id: string): Promise<void> {
    await this.initialize();
    this.countersState.update((counters) =>
      counters.filter((counter) => counter.id !== id),
    );
    await this.persist();
  }

  async clear(): Promise<void> {
    await this.initialize();
    this.countersState.set([]);
    await Preferences.remove({ key: this.storageKey });
  }

  private async load(): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: this.storageKey });

      if (value === null) {
        this.countersState.set([]);
        return;
      }

      const parsed: unknown = JSON.parse(value);

      if (!Array.isArray(parsed)) {
        throw new Error('Uložená historie nemá očekávaný formát pole.');
      }

      this.countersState.set(parsed as SavedCounter[]);
    } catch (error) {
      console.error('Historii počítadel se nepodařilo načíst.', error);
      this.countersState.set([]);
    } finally {
      this.initializedState.set(true);
    }
  }

  private async persist(): Promise<void> {
    await Preferences.set({
      key: this.storageKey,
      value: JSON.stringify(this.countersState()),
    });
  }
}
