let map;
let lat;
let lon;
let map_data = []; //配列
const map_local = 'map_local';

//最初に実行する関数
function GetMap() {
  navigator.geolocation.getCurrentPosition(mapsInit, mapsError, set);
}

// ページ読み込み：map保存データの表示
if(localStorage.getItem('map_local')){
  map_data = JSON.parse(localStorage.getItem('map_local'));
}
if(map_data !== null && map_data.length !==0){
  for(let i = 0; i < map_data.length; i++) {
    // getItemのkeyを使って保存されたデータを全部取得
    var value_all = map_data[i];
    // console.log(value_all);
  
    //一覧表示に追加（テンプレートリテラル）
    var html_data = `
      <div id="past_posi" class="view_past_post">
        <p>・${value_all.obj_name}</p>
        <p>　緯度：${value_all.obj_lat}, 経度：${value_all.obj_lon}</p>
      </div>
      `
      $("#myPast").append(html_data);
      key = i+1;
  }
}
    //****************************************
    //成功関数
    //****************************************
    function mapsInit(position) {
      //lat=緯度、lon=経度 を取得
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      //console.log(lat, lon);
      //Map表示
      map = new Bmap("#myMap");
      map.startMap(lat, lon, "load", 20); //The place is Bellevue.
      map.deletePin(); //pinの削除
      //Pinを追加
      let pin = map.pin(lat, lon, "#ff0000");
      //Infoboxを追加
      //map.infobox(lat, lon, "現在位置", "詳細情報を記載");
      // latとlonをhtmlにいれる
      const html =`
          <p>・現在位置</p>
          <p>　緯度：${lat}, 経度：${lon}</p>
      `
      $("#lat_lon").html(html); //#myGsに位置情報を書き込む
      //クリック位置のgeocodeの取得
      map.onMap("click", function(data){
        map.deletePin(); //pinの削除
        // console.log(data); //Get Geocode ObjectData
        lat = data.location.latitude;  //Get latitude
        lon = data.location.longitude; //Get longitude
        pin = map.pin(lat, lon, "#ff0000");
        const html_c =`
          <div id="lat_lon" class="view_lat_lon">
            <p>・クリック位置</p>
            <p>　緯度：${lat}, 経度：${lon}</p>
          </div>
          `
        $("#lat_lon").html(html_c);
      });
    }
    //****************************************
    //失敗関数
    //****************************************
    function mapsError(error) {
      let e = "";
      if (error.code == 1) { //1＝位置情報取得が許可されてない（ブラウザの設定）
        e = "位置情報が許可されてません";
      }
      if (error.code == 2) { //2＝現在地を特定できない
        e = "現在位置を特定できません";
      }
      if (error.code == 3) { //3＝位置情報を取得する前にタイムアウトになった場合
        e = "位置情報を取得する前にタイムアウトになりました";
      }
      alert("エラー：" + e);
    };
    //****************************************
    //オプション設定
    //****************************************
    const set = {
      enableHighAccuracy: true, //より高精度な位置を求める
      maximumAge: 2000, //最後の現在地情報取得が20秒以内であればその情報を再利用する設定
      timeout: 10000 //10秒以内に現在地情報を取得できなければ、処理を終了
    };

    // 現在位置の取得
    $("#pc_posi").on("click", function() {
      GetMap();
    });

    //save クリックイベント
    $("#now_posi").on("click", function() {
      let name_place = $("#name").val();
     if(!name_place) return; // テキストボックスが空の場合には保存しない
      map_data.push({obj_name:name_place, obj_lat:lat, obj_lon:lon});
      localStorage.setItem('map_local',JSON.stringify(map_data));
      // latとlonをhtmlにいれる
      const html_past =`
      <div id="past_posi" class="view_past_post">
        <p>・${name_place}</p>
        <p>　緯度：${lat}, 経度：${lon}</p>
      </div>
      `
      $("#myPast").append(html_past);
      $("#name").val(""); // テキストボックスを空にする
      //$("#now_posi").off("click");
    });

    // 選択イベント
      $("#del,#can").hide();// ボタンを追加を非表示
      const elms = document.querySelectorAll(".view_past_post");// elementsクラスを持つ要素をすべて取得
      let index;// クリックした要素のインデックスを格納する変数
      elms.forEach((elm) => {// view_past_postを持つ要素すべてに以下の処理を追加する
        elm.addEventListener("click", () => {// クリックしたときに
          // let all_chil = document.getElementById('myPast');
          // all_chil.style.color = "";
          index = [].slice.call(elms).indexOf(elm) + 1;// インデックスを変数indexへ格納する
          console.log(index);
          let parent = document.getElementById('myPast');
          
          parent.children[index].style.color = "red"; //index番目の子要素の色の変更
          //parent.children[index].style.color = "";
          $("#del,#can").show();
                  });
      });