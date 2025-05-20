// 해당 API는 다음과 같은 JSON 형태로 응답
// {
//     "message": "https://images.dog.ceo/breeds/springer-english/n02102040_5449.jpg",
//     "status": "success"
// }

async function LoadRandomDogImage() {
    // 이전에 그려진 박스 지우기
    const canvas = document.getElementById("overlayCanvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    try {
        console.log("Load random dog image!");
        const response = await fetch("https://dog.ceo/api/breeds/image/random");
        if (!response.ok) {
            throw new Error("네트워크 오류");
        }
        const data = await response.json(); // json 다 올 때까지 기다림

        const img = document.getElementById("dogImage");
        img.crossOrigin = "anonymous";
        img.src = data.message;
    } 
    catch (err) {
        console.error("이미지 로드 실패:", err);
    }

}