import './style.scss';
import { createDrawer } from '../nativeRender';

export function attachDrawer() {
  let field = document.querySelector('.draw-pixel_edit-field');
  if (!field) {
    field = document.createElement('div');
    field.className = 'draw-pixel_edit-field';
    document.body.appendChild(field);
  }
  createDrawer(field);
}
