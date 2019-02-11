import React, { PureComponent } from 'react';

class Pixel extends PureComponent {

  render() {
    const {
      scale,
      color
    } = this.props;

    return (
        <div
            className="pixel"
            style={{
              height: scale,
              width: scale,
              background: color //will use hsla
            }}/>
    );
  }
}

export default Pixel;
//базовая вещь. блок в 1 пиксель. увеличивается, меняет цвет и прозрачность
