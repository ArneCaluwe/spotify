import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  favorites = [
    'My Chemical Romance',
    'The Used',
    'Taking Back Sunday',
    'Panic! At the disco',
    'Sam Ryder',
    'The Killers',
  ];
}
