import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastController } from '@ionic/angular';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from '../services/counter.service';
import { Tab1Page } from './tab1.page';

describe('Tab1Page', () => {
  let component: Tab1Page;
  let fixture: ComponentFixture<Tab1Page>;
  let counterServiceMock: { add: ReturnType<typeof vi.fn> };
  let toastMock: { present: ReturnType<typeof vi.fn> };
  let toastControllerMock: { create: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    counterServiceMock = {
      add: vi.fn().mockResolvedValue(undefined),
    };

    toastMock = {
      present: vi.fn().mockResolvedValue(undefined),
    };

    toastControllerMock = {
      create: vi.fn().mockResolvedValue(toastMock),
    };

    TestBed.configureTestingModule({
      providers: [
        Tab1Page,
        { provide: CounterService, useValue: counterServiceMock },
        { provide: ToastController, useValue: toastControllerMock },
      ],
    });

    fixture = TestBed.createComponent(Tab1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call counterService.add and present toast when onSaved is invoked', async () => {
    const counter: SavedCounter = {
      id: 'test',
      name: 'Test',
      value: 1,
      createdAt: '2026-09-17T08:00:00.000Z',
    };

    await component.onSaved(counter);

    expect(counterServiceMock.add).toHaveBeenCalledWith(counter);
    expect(toastControllerMock.create).toHaveBeenCalled();
    expect(toastMock.present).toHaveBeenCalled();
  });
});
