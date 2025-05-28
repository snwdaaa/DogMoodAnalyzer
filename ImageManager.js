// 해당 API는 다음과 같은 JSON 형태로 응답
// {
//     "message": "https://images.dog.ceo/breeds/springer-english/n02102040_5449.jpg",
//     "status": "success"
// }

const img = document.getElementById("dogImage");

// API로 랜덤 이미지 가져오기
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

        img.crossOrigin = "anonymous";
        img.src = data.message;
    } catch (err) {
        console.error("이미지 로드 실패:", err);
    }
}

// 로컬에서 이미지 업로드해 표시하기
const fileInput = document.getElementById("imageInput");

fileInput.addEventListener("change", (event) => { // change 이벤트 -> 이미지 업로드 후
    try {
        // 이전에 그려진 박스 지우기
        const canvas = document.getElementById("overlayCanvas");
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);

        const selectedFile = event.target.files[0]; // 선택한 파일 가져오기
        if (selectedFile != undefined) { // 선택된 파일이 있으면
            if (!selectedFile.type.startsWith("image/")) { // 이미지 아니면 exception throw
                throw new Error("이미지 파일만 업로드할 수 있습니다.");
            }
            
            img.crossOrigin = "anonymous";
            img.src = URL.createObjectURL(selectedFile); // 이미지 태그의 src를 업로드한 이미지의 URL로 설정
            console.log("이미지 업로드 성공");
            fileInput.value = ""; // 입력 파일 비우기
        }
    } catch (err) {
        console.error("이미지 파일 로드 실패:", err);
    }
})

// BBOX가 포함된 최종 이미지 저장
function SaveFinalImage() {
    const dogImage = document.getElementById("dogImage");
    const overlay = document.getElementById("overlayCanvas");

    // dogImage와 overlay 캔버스를 합침
    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = dogImage.width;
    finalCanvas.height = dogImage.height;

    const ctx = finalCanvas.getContext("2d");
    ctx.drawImage(dogImage, 0, 0, dogImage.width, dogImage.height); // 강아지 사진을 canvas에 그림
    ctx.drawImage(overlay, 0, 0, overlay.width, overlay.height); // BBOX를 canvas에 그림

    // 다 합쳐진 canvas를 다운로드
    finalCanvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Analyzed_Result.png";
        a.click();
        URL.revokeObjectURL(url); // 메모리 해제
    })
}