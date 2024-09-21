import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Link, Node } from '../../../d3';
import { CommonModule } from '@angular/common';


@Component({
  selector: '[linkVisual]',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg:line *ngIf="(this.link!.source) as Node"
        class="link"
        [attr.x1]="$any(this.link).source.x"
        [attr.y1]="$any(this.link).source.y"
        [attr.x2]="$any(this.link).target.x"
        [attr.y2]="$any(this.link).target.y"
    ></svg:line>
  `,
  styleUrls: ['./link-visual.component.css']
})
export class LinkVisualComponent {

  @Input('linkVisual') link?: Link;
}