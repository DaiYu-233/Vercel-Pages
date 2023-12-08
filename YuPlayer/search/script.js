var keyword = decodeURI(window.location.search).slice(9);
document.title = "Yu Player | 搜索 - " + keyword;

fetch(`https://music.api.daiyu.fun/cloudsearch?keywords=${keyword}`)
  .then((response) => response.json())
  .then((data) => {
    let songs = data.result.songs;
    for (let i = 0; i < songs.length; i++) {
      let songName = songs[i].name;
      let artists = songs[i].ar.map((artist) => artist.name);
      let songId = songs[i].id;
      console.log(`歌曲名称: ${songName}, 艺术家: ${artists.join(", ")}`);
      var listItem = document.createElement("li");
      listItem.innerHTML = `<a onclick='getSong(${songId})'>${songName} - ${artists}</a>`;
      document.getElementById("main-loading-div").style.display = "none";
      songList.appendChild(listItem);
    }
  })
  .catch((error) => console.error("Error:", error));

async function getSong(id) {
  window.location.href = "/song/index.html?id=" + id;
}
