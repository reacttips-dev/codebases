import {
  LAYER_APPLICATION_AND_DATA,
  LAYER_UTILITIES,
  LAYER_DEVOPS,
  LAYER_BUSINESS_TOOLS,
  LAYER_SLUGS
} from '../constants/layers';

export function reduceLayers(services) {
  return {
    [LAYER_APPLICATION_AND_DATA]: services.filter(
      s => (s.layer && s.layer.slug) === LAYER_SLUGS[LAYER_APPLICATION_AND_DATA]
    ),
    [LAYER_UTILITIES]: services.filter(
      s => (s.layer && s.layer.slug) === LAYER_SLUGS[LAYER_UTILITIES]
    ),
    [LAYER_DEVOPS]: services.filter(s => (s.layer && s.layer.slug) === LAYER_SLUGS[LAYER_DEVOPS]),
    [LAYER_BUSINESS_TOOLS]: services.filter(
      s => (s.layer && s.layer.slug) === LAYER_SLUGS[LAYER_BUSINESS_TOOLS]
    )
  };
}
