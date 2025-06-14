import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'drag-and-drop',
  imports: [],
  templateUrl: './drag-and-drop.component.html',
  styleUrl: './drag-and-drop.component.scss'
})


export class DragAndDrop {
  isHovering = false;
  droppedFile: File | null = null;
  isDrop = false;
  fileConsentiti = ["jpg", "png", "gif", "jpeg"];

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
      } else {
        this.toastr.error("File deve essere jpg,png o gif", " file non valido!");
      }

    }
  }
}
