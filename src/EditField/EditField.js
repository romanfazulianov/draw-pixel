import React from 'react';
import './style.scss';
import { createDrawer } from '../renderService';
import BaseComponent from '../BaseComponent';

class EditField extends BaseComponent {

  state = { field: [] };//it's OK

  getRef = (el) => {
    if(el) {
      this.drawer = createDrawer(el, this.stateUpdaterFn);
    } else {
      this.drawer.end();
    }
  };

  stateUpdaterFn = (field) => {
    this.setState(
        { field },
    );
  };

  renderer({ field }) {
    return (
        <div
            ref={this.getRef}
            className="draw-pixel_edit-field">
          {field}
        </div>
    );
  }
}

export default EditField;
