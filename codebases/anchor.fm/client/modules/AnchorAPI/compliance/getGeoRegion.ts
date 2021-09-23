type GeoRegionResponse = {
  geoCountry: string;
  geoRegion: string;
};

export async function getGeoRegion(): Promise<GeoRegionResponse> {
  try {
    const resp = await fetch('/api/compliance/region', {
      method: 'GET',
      credentials: 'same-origin',
    });
    if (resp.ok) {
      return resp.json();
    }
    throw new Error('Unable to get geo region');
  } catch (e) {
    throw new Error(e.message);
  }
}
