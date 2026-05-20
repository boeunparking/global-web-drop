<?php
// 1. 필수 헤더 설정 (글로벌 분리 구조에서 가장 중요!)
header("Access-Control-Allow-Origin: *"); // React(S3)에서 오는 요청을 허용하는 CORS 설정
header("Content-Type: application/json; charset=UTF-8"); // 응답 형식이 JSON임을 브라우저에 알림
header("Access-Control-Allow-Methods: POST"); // POST 요청만 허용

// 2. 응답할 데이터를 담을 기본 배열 구조 정의
$response = [
    "status" => "error",
    "message" => "Unknown error",
    "download_url" => ""
];

// 3. React가 보낸 파일이 잘 도착했는지 확인
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['shared_file'])) {
    $file = $_FILES['shared_file'];
    
    $fileName = $file['name'];
    $fileTmpName = $file['tmp_name'];
    
    // [실제 구현할 로직] AWS S3 버킷으로 파일을 업로드하거나 EC2 로컬에 저장하는 코드
    // 일주일 프로젝트용 가상 성공 처리 (예시 고유 ID 생성)
    $uniqueId = substr(md5(time()), 0, 8); 
    $targetDownloadUrl = "https://globalshare.link/download/" . $uniqueId;

    // 실제 파일 저장이 성공했다고 가정 시 응답 값 세팅
    $response["status"] = "success";
    $response["message"] = "File uploaded successfully.";
    $response["download_url"] = $targetDownloadUrl;
} else {
    $response["message"] = "Invalid request or no file uploaded.";
}

// 4. PHP 배열을 텍스트 형태의 완벽한 JSON 문자열로 변환하여 React에게 출력(Return)
echo json_encode($response);
exit;
?>