import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-draggable-table',
  templateUrl: './draggable-table.component.html',
  styleUrls: ['./draggable-table.component.css']
})
export class DraggableTableComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  panelOpenState = false;

}
