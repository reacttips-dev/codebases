export var deactivateTour = function deactivateTour(tour, tourKey) {
  if (tourKey) {
    tour.deactivateTour(tourKey);
  } else {
    tour.deactivate();
  }
};