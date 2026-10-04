(() => {
  const errorMessage = document.querySelector("#chart-error");
  const showError = (message) => {
    errorMessage.textContent = message;
    errorMessage.hidden = false;
  };

  if (typeof Chart === "undefined") {
    showError("The chart library did not load. Check your internet connection and refresh this page.");
    return;
  }

  try {
    const records = GoodkindData.load();
    const serviceCounts = GoodkindData.services.map((service) => records.filter((record) => record.service === service).length);
    const scheduledCount = records.filter((record) => record.status === "Scheduled").length;
    const mostBookedIndex = serviceCounts.indexOf(Math.max(...serviceCounts));

    document.querySelector("#total-visits").textContent = String(records.length);
    document.querySelector("#top-service").textContent = records.length ? GoodkindData.services[mostBookedIndex] : "No visits";
    document.querySelector("#scheduled-visits").textContent = String(scheduledCount);

    new Chart(document.querySelector("#service-chart"), {
      type: "bar",
      data: {
        labels: GoodkindData.services,
        datasets: [{
          label: "Sample visits",
          data: serviceCounts,
          backgroundColor: ["#f2b391", "#91aa8a", "#c3a5c9"],
          borderRadius: 8,
          borderSkipped: false,
          maxBarThickness: 68
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { displayColors: false }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#68746c", font: { family: "DM Sans", size: 12 } },
            border: { display: false }
          },
          y: {
            beginAtZero: true,
            ticks: { precision: 0, stepSize: 1, color: "#68746c", font: { family: "DM Sans", size: 11 } },
            grid: { color: "#e9e6dc" },
            border: { display: false }
          }
        }
      }
    });
  } catch (error) {
    showError(`Care data could not be displayed: ${error.message}`);
  }
})();
