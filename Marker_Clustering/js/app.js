// 전역 변수
let map;
let markerClustering;
let businessData = [];

// 지도 초기화
function initMap() {
    // 지도 중심을 서울로 설정
    const mapOptions = {
        center: new naver.maps.LatLng(37.5665, 126.9780),
        zoom: 10,
        mapTypeControl: true
    };
    
    map = new naver.maps.Map('map', mapOptions);
    
    // 사업자 데이터 로드
    loadBusinessData();
}

// 사업자 등록 주소 데이터 로드
async function loadBusinessData() {
    try {
// ————————————————————————————————————————————————————————————————————————
        // 방법 1: JSON 파일에서 로드
        const response = await fetch('data/business-locations.json');
        const data = await response.json();
        businessData = data;

// ————————————————————————————————————————————————————————————————————————
        // 방법 2: API에서 실시간 로드 (그냥.. 생각나서 넣어봤습니다.. 자세히는 X)
        // businessData = await fetchBusinessDataFromAPI();
        
        createMarkers();
        initMarkerClustering();
    } catch (error) {
        console.error('사업자 데이터 로드 실패:', error);
        // 테스트용 데이터 사용
        businessData = generateTestData();
        createMarkers();
        initMarkerClustering();
    }
}


// ————————————————————————————————————————————————————————————————————————


// API에서 사업자 데이터 가져오기 (지금 공공데이터포털 에러가 나서ㅜㅜ 그냥 예시코드? 비슷한 형식으로 작성만 했어요)

async function fetchBusinessDataFromAPI() {
    const serviceKey = 'YOUR_SERVICE_KEY';
    const apiUrl = `https://api.odcloud.kr/api/nts-businessman/v1/validate?serviceKey=${serviceKey}`;
    
    // 실제 구현에서는 사업자등록번호 목록 가지고 주소정보 조회하면 돼요
    const businessNumbers = ['0000000000', '0000000000']; // 예시에요!
    
    const businessLocations = [];
    
    for (const bizNum of businessNumbers) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "b_no": [bizNum]
                })
            });
            
            const result = await response.json();
            
            if (result.match_cnt > 0) {
                // 주소를 좌표로 변환하는 로직 필요
                // 여기서는 예시로 임의 좌표 사용 (나중에 바꿔야 하ㅏㅁ)
                businessLocations.push({
                    businessNumber: bizNum,
                    companyName: "사업자명",
                    address: "주소 정보",
                    lat: 37.5665 + Math.random() * 0.1,
                    lng: 126.9780 + Math.random() * 0.1,
                    businessType: "업종",
                    status: result.data[0].b_stt
                });
            }
        } catch (error) {
            console.error(`사업자번호 ${bizNum} 조회 실패:`, error);
        }
    }
    
    return businessLocations;
}

// 테스트용 데이터 생성
function generateTestData() {
    const testData = [];
    const businessTypes = ['음식점', '카페', '편의점', '마트', '병원', '약국', '미용실', '학원'];
    
    for (let i = 0; i < 100; i++) {
        testData.push({
            businessNumber: `12345678${String(i).padStart(2, '0')}`,
            companyName: `사업자${i + 1}`,
            address: `서울시 강남구 테헤란로 ${i + 1}번길`,
            lat: 37.5665 + (Math.random() - 0.5) * 0.1,
            lng: 126.9780 + (Math.random() - 0.5) * 0.1,
            businessType: businessTypes[Math.floor(Math.random() * businessTypes.length)],
            status: '계속사업자'
        });
    }
    
    return testData;
}

// 마커 생성
function createMarkers() {
    const markers = [];
    
    businessData.forEach((business, index) => {
        const marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(business.lat, business.lng),
            map: null, // 클러스터링에서 관리하므로 null로 설정
            icon: {
                content: `<div class="business-marker" data-business="${index}"></div>`,
                size: new naver.maps.Size(24, 24),
                anchor: new naver.maps.Point(12, 24)
            }
        });
        
        // 마커 클릭 이벤트
        naver.maps.Event.addListener(marker, 'click', function() {
            showBusinessInfo(business, marker);
        });
        
        markers.push(marker);
    });
    
    window.markers = markers; // 전역으로 저장
}

// 사업자 정보창 표시
function showBusinessInfo(business, marker) {
    const infoWindow = new naver.maps.InfoWindow({
        content: `
            <div class="info-window">
                <h4>${business.companyName}</h4>
                <p><strong>사업자등록번호:</strong> ${business.businessNumber}</p>
                <p><strong>주소:</strong> ${business.address}</p>
                <p><strong>상태:</strong> ${business.status}</p>
                <div class="business-type">${business.businessType}</div>
            </div>
        `,
        maxWidth: 300
    });
    
    infoWindow.open(map, marker);
}

// 마커 클러스터링 초기화
function initMarkerClustering() {
    if (!window.markers || window.markers.length === 0) return;
    
    // 클러스터 마커 아이콘 설정
    const htmlMarkers = [
        {
            content: '<div class="cluster-marker cluster-marker-1">10</div>',
            size: new naver.maps.Size(40, 40),
            anchor: new naver.maps.Point(20, 20)
        },
        {
            content: '<div class="cluster-marker cluster-marker-2">100</div>',
            size: new naver.maps.Size(50, 50),
            anchor: new naver.maps.Point(25, 25)
        },
        {
            content: '<div class="cluster-marker cluster-marker-3">1000</div>',
            size: new naver.maps.Size(60, 60),
            anchor: new naver.maps.Point(30, 30)
        }
    ];
    
    // 마커 클러스터링 생성
    markerClustering = new MarkerClustering({
        minClusterSize: 2,          // 클러스터를 구성할 최소 마커 수
        maxZoom: 15,                // 클러스터 마커를 노출할 최대 줌 레벨
        map: map,                   // 지도 객체
        markers: window.markers,    // 마커 배열
        disableClickZoom: false,    // 클러스터 마커 클릭 시 줌 동작 여부
        gridSize: 120,              // 클러스터를 구성할 그리드 크기 (픽셀)
        icons: htmlMarkers,         // 클러스터 마커 아이콘
        indexGenerator: [10, 100, 1000], // 아이콘 선택 기준
        stylingFunction: function(clusterMarker, count) {
            // 클러스터 마커에 개수 표시
            const content = clusterMarker.getIcon().content;
            const $content = $(content);
            $content.text(count);
            clusterMarker.setIcon({
                content: $content.prop('outerHTML'),
                size: clusterMarker.getIcon().size,
                anchor: clusterMarker.getIcon().anchor
            });
        }
    });
}

// 지도 준비 완료 후 초기화
naver.maps.onJSContentLoaded = initMap;

// 페이지 로드 완료 후 초기화 (백업)
$(document).ready(function() {
    if (typeof naver !== 'undefined' && naver.maps && naver.maps.Map) {
        initMap();
    }
});
