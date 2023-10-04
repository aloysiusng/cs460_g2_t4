export default async function getPlantInfo(
  plant_id,
  after_timestamp,
  before_timestamp
) {
  var endpoint =
    process.env.VUE_APP_APIGATEWAY_URL + `/get_plant_info?plant_id=${plant_id}`;
  if (after_timestamp) {
    endpoint += `&after_timestamp=${after_timestamp}`;
  }
  if (before_timestamp) {
    endpoint += `&before_timestamp=${before_timestamp}`;
  }

  fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      console.log(response.json());
      return response.json();
    })
    .catch((error) => {
      console.log(error);
    });
}
