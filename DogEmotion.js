import { InferenceEngine, CVImage } from "inferencejs";

const MODEL_NAME = "emotions-5jlfd";
const MODEL_VERSION = 2;
const PUBLISHABLE_KEY = "rf_4Y9I5h58aHccAsPHtwgu6VDCwVy1";

let engine;
let workerId;

export async function LoadEmotionModel() {
    engine = new InferenceEngine();
    workerId = await engine.startWorker(
        MODEL_NAME,
        MODEL_VERSION,
        PUBLISHABLE_KEY
    );

    while(!engine) { // 추론 엔진 로드될 때까지 대기하게 함
        await new Promise(resolve => setTimeout(resolve, 50));
    }

    return true;
}

document.getElementById("analyzeBtn").addEventListener("click", async () => {
    const image = document.getElementById("dogImage");
    const cvimg = new CVImage(image);
    const results = await engine.infer(workerId, cvimg);

    // results 빈 리스트면 alert 출력
    if (results.length == 0)
        alert("인식에 실패했습니다! 다른 사진으로 시도하세요.");
    else
        DrawBBOX(image, results);
    console.log(results);
});

// 강아지 인식하고 바운딩 박스 그리기
function DrawBBOX(image, results) {
    console.log("Draw BBox");
    const canvas = document.getElementById("overlayCanvas");
    const context = canvas.getContext("2d");

    // 이전에 그려진 박스 지우기
    context.clearRect(0, 0, canvas.width, canvas.height);

    // 640x640으로 고정하기 전 이미지의 원래 width, height 가져옴
    const origWidth = image.naturalWidth;
    const origHeight = image.naturalHeight;

    // 변환 스케일 계산
    const scaleX = canvas.width / origWidth;
    const scaleY = canvas.height / origHeight;

    results.forEach(obj => {
        const {x, y, width, height} = obj.bbox; // 바운딩 박스 정보 가져오기

        const classLabels = { // 기분 키워드 (0:relaxed, 1:happy, 2:angry, 3:sad)
            0: "편안함",
            1: "행복함",
            2: "화남",
            3: "슬픔"
        }
        const label = classLabels[obj.class] || "unknown";
        const confidence = obj.confidence; // 신뢰도
        const color = "rgb(255, 0, 0)"; // CSS 태그를 문자열로 파싱해서 사용

        // 왼쪽 위 기준 좌표 계산 (스케일 고려)
        const left = (x - width / 2) * scaleX;
        const top = ((y - height / 2) * scaleY);
        const boxWidth = width * scaleX;
        const boxHeight = height * scaleY;

        // 바운딩 박스 그리기
        context.strokeStyle = color;
        context.lineWidth = 3;
        context.strokeRect(left, top, boxWidth, boxHeight);

        // 라벨
        context.font = "bold 25px sans-serif";
        context.fillStyle = color;
        context.shadowBlur = 15;
        context.fillText(`${label} (${(confidence * 100).toFixed(1)}%)`, left + 4, top - 6);
    });
}