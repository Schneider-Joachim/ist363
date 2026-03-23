const endpoint =
  "https://api.open-meteo.com/v1/forecast?latitude=43.0481&longitude=-76.1474&hourly=temperature_2m,precipitation,cloud_cover&timezone=auto";

fetch(endpoint)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    const precipitation = data.hourly.precipitation[0];
    const temperature = data.hourly.temperature_2m[0];
    const cloudCover = data.hourly.cloud_cover[0];

    document.querySelector("#precipitation").innerText = precipitation + " mm";
    document.querySelector("#temperature").innerText = temperature + " °C";

    if (cloudCover >= 50) {
      document.querySelector("#cloud").innerText = "☁️";
    } else {
      document.querySelector("#cloud").innerText = "☀️";
    }
  })
  .catch(function (error) {
    console.log("Error:", error);
    document.querySelector("#precipitation").innerText = "N/A";
    document.querySelector("#temperature").innerText = "N/A";
    document.querySelector("#cloud").innerText = "❌";
  });
