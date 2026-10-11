import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from '../services/counter.service';
import { Tab2Page } from './tab2.page';

describe('Tab2Page', () => {
  let component: Tab2Page;
  let fixture: ComponentFixture<Tab2Page>;
  let counterServiceMock: {
    counters: ReturnType<typeof signal<SavedCounter[]>>;
    initialized: ReturnType<typeof signal<boolean>>;
    initialize: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
    clear: ReturnType<typeof vi.fn>;
  };
  let alertMock: { present: ReturnType<typeof vi.fn> };
  let alertControllerMock: { create: ReturnType<typeof vi.fn> };
  let toastMock: { present: ReturnType<typeof vi.fn> };
  let toastControllerMock: { create: ReturnType<typeof vi.fn> };

  const sampleCounters: SavedCounter[] = [
    { id: '1', name: 'Banan', value: 5, createdAt: '2026-01-01T10:00:00.000Z' },
    { id: '2', name: 'Jablko', value: 10, createdAt: '2026-01-02T10:00:00.000Z' },
  ];

  beforeEach(async () => {
    counterServiceMock = {
      counters: signal(sampleCounters),
      initialized: signal(true),
      initialize: vi.fn().mockResolvedValue(undefined),
      remove: vi.fn().mockResolvedValue(undefined),
      clear: vi.fn().mockResolvedValue(undefined),
    };

    alertMock = { present: vi.fn().mockResolvedValue(undefined) };
    alertControllerMock = { create: vi.fn().mockResolvedValue(alertMock) };

    toastMock = { present: vi.fn().mockResolvedValue(undefined) };
    toastControllerMock = { create: vi.fn().mockResolvedValue(toastMock) };

    await TestBed.configureTestingModule({
      providers: [
        Tab2Page,
        { provide: CounterService, useValue: counterServiceMock },
        { provide: AlertController, useValue: alertControllerMock },
        { provide: ToastController, useValue: toastControllerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Tab2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call initialize on ngOnInit', () => {
    expect(counterServiceMock.initialize).toHaveBeenCalled();
  });

  it('should calculate totalSum correctly', () => {
    expect(component.totalSum()).toBe(15);
  });

  it('should calculate averageValue correctly (Varianta A)', () => {
    expect(component.averageValue()).toBe(7.5);

    counterServiceMock.counters.set([]);
    expect(component.averageValue()).toBe(0);
  });

  it('should filter counters by search query', () => {
    component.searchQuery.set('jab');
    const filtered = component.filteredCounters();
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Jablko');
  });

  it('should sort counters correctly', () => {
    component.sortOrder.set('value-desc');
    const sorted = component.filteredCounters();
    expect(sorted[0].value).toBe(10);
    expect(sorted[1].value).toBe(5);

    component.sortOrder.set('value-asc');
    const sortedAsc = component.filteredCounters();
    expect(sortedAsc[0].value).toBe(5);
    expect(sortedAsc[1].value).toBe(10);
  });

  it('should remove a counter and show toast', async () => {
    await component.remove('1');
    expect(counterServiceMock.remove).toHaveBeenCalledWith('1');
    expect(toastControllerMock.create).toHaveBeenCalled();
    expect(toastMock.present).toHaveBeenCalled();
  });

  it('should clear all counters and show toast', async () => {
    await component.clear();
    expect(counterServiceMock.clear).toHaveBeenCalled();
    expect(toastControllerMock.create).toHaveBeenCalled();
    expect(toastMock.present).toHaveBeenCalled();
  });

  it('should present confirmation alert when confirmClear is called', async () => {
    await component.confirmClear();
    expect(alertControllerMock.create).toHaveBeenCalled();
    expect(alertMock.present).toHaveBeenCalled();
  });
});
