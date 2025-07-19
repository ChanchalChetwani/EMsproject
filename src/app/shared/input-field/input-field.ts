import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input-field.html',
  styleUrl: './input-field.scss'
})
export class InputField {
  @Input() model: string = '';
  @Output() modelChange = new EventEmitter<string>();

  onInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.model = value;
    this.modelChange.emit(this.model);
  }
}
