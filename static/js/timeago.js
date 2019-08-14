function calculateTimeSince(num){
  const currentTime = Math.floor(Date.now()/1000);
  const timestamp = parseInt(num);
  const timeSince = currentTime - timestamp;

  var timeAgo;
  var timeTag;
  var minute = 60;
  var hour = 3600;
  var day = 86400;
  var week = 604800;
  var month = 2.628e+6;
  var year = 3.154e+7;

  if (timeSince < minute ) {
    timeAgo = 1;
    timeTag = ' MIN';
  } else if (timeSince > minute && timeSince < hour ) {
    timeAgo = Math.ceil(timeSince / minute);
    timeTag = ' MIN';
  } else if (timeSince > hour && timeSince < day ) {
    timeAgo = Math.floor(timeSince / hour);
    timeTag = ' HR';
  } else if (timeSince > day && timeSince < week) {
    timeAgo = Math.floor(timeSince / day);
    timeTag = ' DAY';
  } else if (timeSince > week && timeSince < month) {
    timeAgo = Math.floor(timeSince / week);
    timeTag = ' WK';
  } else if (timeSince > month && timeSince < year) {
    timeAgo = Math.floor(timeSince / month);
    timeTag = ' MONTH';
  } else if (timeSince > year) {
    timeAgo = Math.floor(timeSince / year);
    timeTag = ' YR';
  }

  let decorator = timeAgo < 2 ? ' AGO' : 'S AGO';
  return `${timeAgo}&nbsp;${timeTag}${decorator}`;
}

function populateCommentsTime(nodes) {
  if (nodes) {
    nodes.forEach(function(node) {
      let durationTime = node.dataset.time;
      let durationSeconds = Math.ceil(Date.parse(durationTime) / 1000) ;
      let durationSince = calculateTimeSince(durationSeconds);
      node.innerHTML = `${durationSince}`;
    });
  }
}

const durations = document.querySelectorAll('.comment_heading');

populateCommentsTime(durations);
