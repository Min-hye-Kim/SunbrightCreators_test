navigator.geolocation.getCurrentPosition(function(position) {
  // 내 위치 정보는 position.coords에!
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  console.log("위도:", latitude, "경도:", longitude);
});



//      if (navigator.geolocation) {
//          GPS기능 사용 O
//       } else {``
//    GPS기능 사용 X
// } 위치정보 요청
//}

// document.getElementById("location").innerText 
// = "위도: " + latitude + ", 경도: " + longitude;