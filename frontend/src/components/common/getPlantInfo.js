export default async function getPlantInfo(
  plant_id,
  after_time_stamp,
  before_time_stamp
) {
  var endpoint =
    process.env.VUE_APP_APIGATEWAY_URL + `/get_plant_info?plant_id=${plant_id}`;
  if (after_time_stamp) {
    endpoint += `&after_time_stamp=${after_time_stamp}`;
  }
  if (before_time_stamp) {
    endpoint += `&before_time_stamp=${before_time_stamp}`;
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
