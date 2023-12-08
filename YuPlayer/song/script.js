let id = decodeURI(window.location.search).slice(4);

fetch(`https://music.api.daiyu.fun/check/music/url?id=${id}`)
  .then((response) => response.json())
  .then((data) => {
    let returnData = document.getElementById("returnData");
    let success = data.success;
    if (!success) {
      document.getElementById("main-loading-div").style.display = "none";
      returnData.textContent = JSON.stringify(data, null, 2);
    } else {
      fetch(`https://music.api.daiyu.fun/song/url?id=${id}`)
        .then((response) => response.json())
        .then((data) => {
          let songUrl = data.data[0].url;
          let audio = document.createElement("audio");
          audio.src = songUrl;
          audio.controls = true;
          audio.id = "audio";
          document.body.appendChild(audio);
          document.getElementById("main-loading-div").style.display = "none";

          // 获取歌词
          fetch(`https://music.api.daiyu.fun/lyric?id=${id}`)
            .then((response) => response.json())
            .then((data) => {
              let lyric = data.lrc.lyric;
              let lyricDiv = document.getElementById("lyric");
              let audio = document.getElementById("audio");

              // 解析歌词
              let lines = lyric.split("\n");
              let pattern = /\[\d{2}:\d{2}.\d{3}\]/g;
              let result = [];

              for (let i = 0; i < lines.length; i++) {
                let time = lines[i].match(pattern);
                let value = lines[i].replace(pattern, "");

                if (time) {
                  for (let j = 0; j < time.length; j++) {
                    let t = time[j].slice(1, -1).split(":");
                    let timeInSeconds =
                      parseInt(t[0], 10) * 60 + parseFloat(t[1]);
                    result.push([timeInSeconds, value]);
                  }
                }
              }

              // 创建歌词元素
              let index = 0;
              result.forEach((item) => {
                // 检查歌词是否为空
                // if (item[1].trim() !== "") {
                  let element = document.createElement("p");
                  element.id = "line-" + index;
                  element.textContent = item[1];
                  element.classList.add("lyric-p")
                  lyricDiv.appendChild(element);
                  index++;
                // }
              });

              // 根据播放进度显示歌词
              audio.ontimeupdate = function () {
                for (let i = 0; i < result.length; i++) {
                  if (this.currentTime /* audio的播放时间 */ > result[i][0]) {
                    // 清除之前的高亮歌词
                    let previousElement = document.querySelector(".highlight");
                    if (previousElement) {
                      previousElement.classList.remove("highlight");
                    }

                    // 高亮当前歌词
                    let currentElement = document.getElementById("line-" + i);
                    if (currentElement) {
                      currentElement.classList.add("highlight");

                      // 打印歌词索引
                      console.log("当前歌词是第" + (i + 1) + "项");

                      var top =
                        document.getElementById("lyric-div").offsetHeight / 2 -
                        i * 25 +
                        "px";
                      lyricDiv.style.top = top;
                      console.log(top);
                    }
                  }
                }
              };
            });
        })
        .catch((error) => console.error("Error:", error));
    }
  })
  .catch((error) => console.error("Error:", error));
