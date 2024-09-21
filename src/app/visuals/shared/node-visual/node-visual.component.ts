import { Component, Input, OnChanges } from '@angular/core';
import { Node } from '../../../d3';

@Component({
  selector: '[nodeVisual]',
  standalone: true,
  imports: [],
  template: `
    <svg:circle
        class="node"
        [attr.fill]="node.color"
        [attr.cx]="node.x"
        [attr.cy]="node.y"
        [attr.r]="node.r">
    </svg:circle>
    <svg:text
        class="node-name"
        [attr.font-size]="node.fontSize"
        [attr.x]="node.x"
        [attr.y]="node.y">
      {{node.id}}
    </svg:text>
  `,
  styleUrls: ['./node-visual.component.css']
})
export class NodeVisualComponent {
  @Input('nodeVisual') node!: Node;
}
