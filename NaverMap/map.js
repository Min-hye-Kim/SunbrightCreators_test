// 전역 변수
let map;
let currentMarker = null;

// 지도 초기화 함수
function initMap() {
    // 서울시청 좌표 (걍 예시..)
    const seoulCityHall = new naver.maps.LatLng(37.5666805, 126.9784147);
    
    // 지도 옵션 설정
    const mapOptions = {    
        center: seoulCityHall,  // 지도 중심 좌표
        zoom: 15,               // 줌 레벨 (1~21)
        mapTypeControl: true,   // 지도 타입 컨트롤 표시
        zoomControl: true,      // 줌 컨트롤 표시
        zoomControlOptions: {
            position: naver.maps.Position.TOP_RIGHT
        }
    };

//——————————————————————————————————————————————————————————————
// 지도 생성
    map = new naver.maps.Map('map', mapOptions);
    
    // 기본 마커 생성 (서울 시청)
    const defaultMarker = new naver.maps.Marker({
        position: seoulCityHall,
        map: map,
        title: '서울특별시청'
    });
    
    // 지도 클릭 이벤트 리스너 등록
    naver.maps.Event.addListener(map, 'click', onMapClick);
    
    console.log('지도 초기화 완료');
}

// 지도 클릭 이벤트 핸들러
function onMapClick(e) {
    // 클릭한 좌표 가져오기
    const clickedLat = e.coord.lat();
    const clickedLng = e.coord.lng();
    
    console.log(`클릭한 좌표: 위도 ${clickedLat}, 경도 ${clickedLng}`);
    
    document.getElementById('coordinates').textContent = 
        `위도: ${clickedLat.toFixed(6)}, 경도: ${clickedLng.toFixed(6)}`;
       // 좌표 정보를 화면에 표시
    if (currentMarker) {
        currentMarker.setMap(null);
    }    // 이전 마커가 있으면 → 제거
    
    // 새 마커 생성
    currentMarker = new naver.maps.Marker({
        position: e.coord,  // 클릭한 위치
        map: map,
        title: '클릭한 위치',
        icon: {
            url: 'https://navermaps.github.io/maps.js.ncp/docs/img/example/pin_default.png',
            //걍 구글링해서 네이버 맵 이미지 가져왔습니다!
            size: new naver.maps.Size(22, 35),
            anchor: new naver.maps.Point(11, 35)
        }
    });
    
    naver.maps.Event.addListener(currentMarker, 'click', function() {
        alert(`마커 위치: 위도 ${clickedLat.toFixed(6)}, 경도 ${clickedLng.toFixed(6)}`);
    });    // 마커 '클릭' 이벤트 추가

}

window.onload = function() { 
    initMap();
}; // 윈도우 로드 완료 후 지도 초기화

