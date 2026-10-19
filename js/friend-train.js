(function () {
  var train = document.querySelector('[data-friend-train]');
  if (!train) return;

  var stations = Array.prototype.slice.call(document.querySelectorAll('.friend-card'));
  if (!stations.length) return;

  var currentLink = train.querySelector('[data-friend-train-link]');
  var visitLink = train.querySelector('[data-friend-train-visit]');
  var name = train.querySelector('[data-friend-train-name]');
  var description = train.querySelector('[data-friend-train-description]');
  var url = train.querySelector('[data-friend-train-url]');
  var position = train.querySelector('[data-friend-train-position]');
  var index = 0;

  function showStation(nextIndex) {
    index = (nextIndex + stations.length) % stations.length;
    var station = stations[index];
    var stationUrl = station.href;

    currentLink.href = stationUrl;
    visitLink.href = stationUrl;
    name.textContent = station.dataset.friendName || stationUrl;
    description.textContent = station.dataset.friendDescription || '';
    url.textContent = stationUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
    position.textContent = (index + 1) + ' / ' + stations.length;
  }

  train.querySelector('[data-friend-train-prev]').addEventListener('click', function () {
    showStation(index - 1);
  });
  train.querySelector('[data-friend-train-next]').addEventListener('click', function () {
    showStation(index + 1);
  });

  showStation(0);
}());
