import { PureComponent } from 'react';

export default class BaseComponent extends PureComponent {
  renderer(state, props) {
    return null;
  }

  render() {
    return this.renderer(this.state, this.props);
  }
}
