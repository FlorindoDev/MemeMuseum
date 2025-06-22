import { Component, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'drag-and-drop',
  imports: [],
  templateUrl: './drag-and-drop.component.html',
  styleUrl: './drag-and-drop.component.scss'
})


export class DragAndDrop {
  isHovering = false;
  isError = false;
  droppedFile: File | null = null;
  isDrop = false;
  fileConsentiti = ["jpg", "png", "gif", "jpeg"];
  @Output() loadedfile = new EventEmitter<File>()

  constructor(private toastr: ToastrService) { }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isHovering = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isHovering = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isHovering = false;

    if (event.dataTransfer?.files.length) {

      this.droppedFile = event.dataTransfer.files[0];
      if (this.fileConsentiti.find((val) => this.droppedFile?.type === `image/${val}`)) {
        this.isDrop = true;
        this.isError = false;
        this.loadedfile.emit(this.droppedFile);

      } else {
        this.isError = true;
        this.isDrop = false;
        this.toastr.error("File deve essere jpg,png o gif", " file non valido!");
      }

    }
  }

  onFileBrowse(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.droppedFile = input.files[0];

      if (this.fileConsentiti.find((val) => this.droppedFile?.type === `image/${val}`)) {
        this.isDrop = true;
        this.isError = false;
        this.loadedfile.emit(this.droppedFile);
      } else {
        this.isError = true;
        this.isDrop = false;
        this.toastr.error("File deve essere jpg, png o gif", "File non valido!");
      }
    }
  }

}
