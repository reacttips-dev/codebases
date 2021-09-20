export default class extends React.Component {
  static displayName = 'atoms/unknown-atom';

  render() {
    return (
      <div>
        <h1 style={{ color: 'red' }}>Unknown Atom</h1>
        {JSON.stringify(this.props, null, 2)}
      </div>
    );
  }
}
