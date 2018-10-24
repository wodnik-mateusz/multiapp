import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MapConsumer } from '../../Map';

class Layer extends Component {
  componentDidMount() { //eslint-disable-line
    const { map, icon, custom } = this.props;
    if (map && icon) {
      return this.addIcon(map, icon)
        .then(() => {
          this.addLayer(map);
          custom(map);
          console.log('eloelo', custom);
        })
        .catch(console.error);
    }
    if (map) {
      this.addLayer(map);
      custom(map);
      console.log('eloelo', custom)
    }
  }

  componentDidUpdate(prevProps) { //eslint-disable-line
    const {
      map,
      features,
      id,
      icon,
      custom,
      hide,
    } = this.props;
    if (prevProps.map !== map) {
      if (icon) {
        return this.addIcon(map, icon)
          .then(() => this.addLayer(map))
          .catch(console.error);
      }
      this.addLayer(map);
      console.log('eloell', custom)
      custom(map);
    }
    if (prevProps.features !== features) {
      const source = map.getSource(id);
      source && source.setData(features);
    }
    if (prevProps.hide !== hide) {
      map.setLayoutProperty(id, 'visibility', hide ? 'none' : 'visible');
    }
  }

  addIcon = (map, icon) => (
    new Promise((resolve, reject) => {
      map.loadImage(icon, (error, image) => {
        if (error) reject(error);
        map.addImage(icon, image);
        resolve(true);
      });
    })
  );

  addLayer = (map) => {
    const {
      id,
      features,
      icon,
      iconSize = 1,
      textField = '',
      textSize = 10,
      hide,
    } = this.props;
    const placeholder = {
      type: 'FeatureCollection',
      features: [],
    };
    const data = features.type ? features : placeholder;
    map.addSource(id, { type: 'geojson', data });
    map.addLayer({
      id,
      type: 'symbol',
      source: id,
      layout: {
        'icon-image': icon,
        'icon-size': iconSize,
        'text-field': textField ? `{${textField}}` : '',
        'text-size': textSize,
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        'text-offset': [0, 1],
        'text-anchor': 'top',
        visibility: hide ? 'none' : 'visible',
      },
    });
  };

  handleCustomBehaviour = (func) => func();

  render = () => null;
}

Layer.defaultProps = {
  map: undefined,
  id: '',
  features: undefined,
  icon: '',
  iconSize: 1,
  textField: '',
  textSize: 10,
};

Layer.propTypes = {
  map: PropTypes.objectOf(PropTypes.object),
  id: PropTypes.string,
  features: PropTypes.objectOf(PropTypes.any),
  icon: PropTypes.string,
  iconSize: PropTypes.number,
  textField: PropTypes.string,
  textSize: PropTypes.number,
};

export default React.forwardRef((props, ref) => (
  <MapConsumer>
    {context => <Layer {...props} {...context} ref={ref} />}
  </MapConsumer>
));
