function GoSearch() {
  if (document.getElementById("SearchBox").value != "") {
    window.location.href =
      "/search/index.html?keyword=" + document.getElementById("SearchBox").value;
  } else {
    alert("搜索内容不可为空");
  }
}
