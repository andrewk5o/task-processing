import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusBadge } from './status-badge';

describe('StatusBadge', () => {
  let component: StatusBadge;
  let fixture: ComponentFixture<StatusBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusBadge]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StatusBadge);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default status value', () => {
    expect(component.status()).toBe('Pending');
  });

  it('should generate badge classes with default status', () => {
    const classes = component.badgeClasses();
    expect(classes).toContain('badge');
    expect(classes).toContain('badge--pending');
  });

  it('should have computed badgeClasses function', () => {
    expect(typeof component.badgeClasses).toBe('function');
    expect(component.badgeClasses()).toBeDefined();
  });
});
