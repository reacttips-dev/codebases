import { __ } from 'services/localization-service';

export default class extends React.Component {
  static displayName = 'notifications/speaker-series';

  render() {
    return (
      <div>
        <a href="https://www.udacity.com/talks" target="_blank">
          {__(
            ' RSVP to Live Chat with VR pioneer Eric Darnell, director of Madagascar, Antz, and the new CCO of Baobab Studios!'
          )}
        </a>
      </div>
    );
  }
}
