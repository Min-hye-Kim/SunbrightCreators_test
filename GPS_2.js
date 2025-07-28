if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      document.getElementById("location").innerText = `위도: ${latitude}, 경도: ${longitude}`;
      console.log("위도:", latitude, "경도:", longitude);
    },
    (error) => {
      // 에러 발생 시 처리 (예: 거부했거나 실패했을 때)
      document.getElementById("location").innerText = "위치 정보를 가져올 수 없습니다.";
      console.error(error);
    }
  );
} else {
  // GPS 기능을 지원하지 않는 경우
  document.getElementById("location").innerText = "이 브라우저에서는 위치 정보 사용이 지원되지 않습니다.";
}

