import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AlbumsState } from '@app/state/album.state';
import { NgxsModule, Store } from '@ngxs/store';
import { NewReleaseComponent } from './new-release.component';

describe('NewReleaseComponent', () => {
  let component: NewReleaseComponent;
  let fixture: ComponentFixture<NewReleaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NewReleaseComponent,
        NgxsModule.forRoot([AlbumsState]),
        HttpClientTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewReleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get albums from state', done => {
    component.albumId = '1';
    const store = TestBed.inject(Store);
    const state = {
      albums: {
        newReleases: [
          { id: '1', name: 'Album 1', images: [{}, {}, { url: 'some-url' }] },
        ],
      },
    };
    store.reset(state);

    fixture.detectChanges();
    component.album$.subscribe(album => {
      expect(album?.id).toEqual('1');
      expect(album?.name).toEqual('Album 1');
      done();
    });
  });
});
