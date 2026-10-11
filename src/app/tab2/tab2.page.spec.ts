import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CounterService } from '../services/counter.service';
import { Tab2Page } from './tab2.page';

describe('Tab2Page', () => {
  let component: Tab2Page;
  let fixture: ComponentFixture<Tab2Page>;
  let counterServiceMock: {
    counters: ReturnType<typeof signal>;
    initialized: ReturnType<typeof signal>;
    initialize: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
    clear: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    counterServiceMock = {
      counters: signal([]),
      initialized: signal(true),
      initialize: vi.fn().mockResolvedValue(undefined),
      remove: vi.fn().mockResolvedValue(undefined),
      clear: vi.fn().mockResolvedValue(undefined),
    };

    await TestBed.configureTestingModule({
      providers: [
        Tab2Page,
        { provide: CounterService, useValue: counterServiceMock },
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

  it('should call remove on counterService', async () => {
    await component.remove('test-id');
    expect(counterServiceMock.remove).toHaveBeenCalledWith('test-id');
  });

  it('should call clear on counterService', async () => {
    await component.clear();
    expect(counterServiceMock.clear).toHaveBeenCalled();
  });
});
