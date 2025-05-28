// API 로딩 끝나야 페이지 표시

import { LoadEmotionModel } from './DogEmotion';

window.addEventListener("DOMContentLoaded", async () => {
    const loadingScreen = document.getElementById("loadingScreen");
    const mainContent = document.getElementById("mainContent");
    
    try {
        await Promise.all([
            LoadEmotionModel()
        ]);
    
        // 로딩 완료 후 화면 전환
        console.log("API 로드 성공");
        loadingScreen.style.display = "none";
        mainContent.style.display = "block";
    } catch (e) {
        console.error("API 로딩 실패", e);
    }
})
