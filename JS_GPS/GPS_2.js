if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      document.getElementById("location").innerText = `위도: ${latitude}, 경도: ${longitude}`;
      console.log("위도:", latitude, "경도:", longitude);
    },
    (error) => {
      // 에러처리 (e.g. 거부 or 실패)
      document.getElementById("location").innerText = "위치 정보 가져오기 실패";
      console.error(error);
    }
  );
} else {
      // GPS 기능 지원 X 경우
  document.getElementById("location").innerText = "브라우저에서 위치정보 사용 지원 X";
}

