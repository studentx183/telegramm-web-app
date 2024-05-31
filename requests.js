axios.defaults.baseURL = config.baseUrl;

const getZones = async () => await getData("/zone/list");

const getRegionsByZoneId = async (zoneId) =>
  await getData(`/region/list/by-zoneId?zoneId=${zoneId}`);

const getCitiesByRegionId = async (regionId) =>
  await getData(`/city/list/by-regionId?regionId=${regionId}`);

const getFormats = async () => await getData("/format/list");

const getCategories = async () => await getData("/client-category/list");

const getChannels = async () => await getData("/sales-channel/list");

const getTypes = async () => await getData("/client-type/list");

const postClient = async (data) => await postData("/client/create", data);

const postRegistrationData = async (data) =>
  await postData("/client/get-agent-code", data);

const getData = async (url) => {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const postData = async (url, data) => {
  try {
    const response = await axios.post(url, data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export {
  getZones,
  getRegionsByZoneId,
  getCitiesByRegionId,
  getFormats,
  getCategories,
  getChannels,
  getTypes,
  postClient,
  postRegistrationData,
};
